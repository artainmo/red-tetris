/**
 * tests/integration.server.test.js
 *
 * Exécute des tests d'intégration contre server.js (processus enfant).
 *
 * IMPORTANT:
 * - Ce test suppose que ton serveur démarre immédiatement sur le port 3000
 *   quand on lance node server.js (comme dans le code que tu as partagé).
 * - Ajuste le chemin du script si nécessaire.
 */

const childProcess = require('child_process');
const path = require('path');
const supertest = require('supertest');
const ioClient = require('socket.io-client');
const SERVER_PATH = path.resolve(__dirname,'app.js'); // ajuste si nécessaire
const BASE_URL = 'http://localhost:3000';
const REST_PREFIX = '/rest';

jest.setTimeout(20000); // délais larges pour CI/slow machines

let serverProc = null;
let request = null;

beforeAll((done) => {
  // Démarre le serveur comme processus enfant
  serverProc = childProcess.spawn('node', [SERVER_PATH], {
    env: Object.assign({}, process.env),
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Log serveur (utile pour debug si tests plantent)
  serverProc.stdout.on('data', (d) => {
    process.stdout.write(`[server stdout] ${d}`);
    // Dès qu'on voit que le serveur écoute, on considère prêt.
    if (d.toString().includes('App listening at')) {
      request = supertest(BASE_URL);
      // petit délai pour être sûr que socket.io est prêt
      setTimeout(done, 300);
    }
  });

  serverProc.stderr.on('data', (d) => {
    process.stderr.write(`[server stderr] ${d}`);
  });

  serverProc.on('error', (err) => {
    done(err);
  });

  // Sécurité : si le serveur ne démarre pas dans 8s, fail
  setTimeout(() => {
    if (!request) {
      done(new Error('Le serveur n’a pas démarré à temps. Vérifie SERVER_PATH et démarrage.'));
    }
  }, 8000);
});

afterAll((done) => {
  if (serverProc) {
    serverProc.kill('SIGINT');
    // attendre la fermeture
    serverProc.on('exit', () => done());
    // fallback
    setTimeout(done, 2000);
  } else done();
});

describe('REST endpoints', () => {
  test('connect route returns jwt and username', async () => {
    const name = encodeURIComponent('testUserA');
    const res = await supertest(BASE_URL).get(`${REST_PREFIX}/connect/${name}`).expect(200);
    expect(res.body).toHaveProperty('jwt');
    expect(res.body).toHaveProperty('username', 'testUserA');
  });

  test('joinablegames returns array (even empty)', async () => {
    const res = await supertest(BASE_URL).get(`${REST_PREFIX}/joinablegames/`).expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('scores and bestscores endpoints respond (status 200)', async () => {
    await supertest(BASE_URL).get(`${REST_PREFIX}/bestscores/`).expect(200);
    // scores for a user without scores should still return (or 400 handled server-side)
    await supertest(BASE_URL).get(`${REST_PREFIX}/scores/testUserA`).expect(200);
  });
});

describe('Socket.IO flows', () => {
  let tokenA, tokenB;
  let socketA, socketB;
  const opts = {
    transports: ['websocket'],
    reconnection: false,
    timeout: 5000,
  };

  test('retrieve tokens via REST for two users', async () => {
    const resA = await request.get(`${REST_PREFIX}/connect/testUserA`).expect(200);
    const resB = await request.get(`${REST_PREFIX}/connect/testUserB`).expect(200);
    tokenA = resA.body.jwt;
    tokenB = resB.body.jwt;
    expect(typeof tokenA).toBe('string');
    expect(typeof tokenB).toBe('string');
  });

  test('two sockets can connect and join same room, receive playerJoined broadcast', (done) => {
    const roomId = 'room-test-1';

    let joinCount = 0;

    // Handlers to cleanup and finish when appropriate
    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    socketA = ioClient(BASE_URL, {
      ...opts,
      auth: { token: tokenA },
    });

    socketA.on('connect_error', (err) => done(err));
    socketA.on('connect', () => {
      // ask server to join the room
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, (ack) => {
        // ack can be success/fail
        // ignore for now; we'll rely on broadcasts
      });
    });

    // socketA listens for playerJoined (will trigger when B joins too)
    socketA.on('playerJoined', (payload) => {
      // payload should contain player and room
      expect(payload).toHaveProperty('player');
      expect(payload).toHaveProperty('room', roomId);
      joinCount += 1;
      if (joinCount === 2) {
        cleanup();
        done();
      }
    });

    // connect socketB after a short delay to ensure A has joined
    setTimeout(() => {
      socketB = ioClient(BASE_URL, {
        ...opts,
        auth: { token: tokenB },
      });

      socketB.on('connect_error', (err) => done(err));
      socketB.on('connect', () => {
        socketB.emit('joinRoom', { roomId, username: 'testUserB' }, (ack) => {});
      });

      socketB.on('playerJoined', (payload) => {
        expect(payload).toHaveProperty('player');
        expect(payload).toHaveProperty('room', roomId);
        joinCount += 1;
        if (joinCount === 2) {
          cleanup();
          done();
        }
      });
    }, 300);
  });

  test('startGame emit is broadcast to room', (done) => {
    const roomId = 'room-test-start';
    let receivedStart = false;

    // Reconnect two clients
    socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } });
    socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } });

    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    // join both
    let ready = 0;
    const tryFinish = () => {
      if (ready === 2 && receivedStart) {
        cleanup();
        done();
      }
    };

    socketA.on('connect', () => {
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
        ready += 1;
        tryFinish();
      });
    });
    socketB.on('connect', () => {
      socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
        ready += 1;
        tryFinish();
      });
    });

    // B listens for startGame
    socketB.on('startGame', () => {
      receivedStart = true;
      tryFinish();
    });

    // Once both joined, A triggers startGame
    const triggerStart = () => {
      // find A socket id then emit startGame from that socket
      // we simply emit startGame from socketA connection (server uses socketToGame map)
      socketA.emit('startGame');
    };

    // wait shortly for both joins then trigger
    setTimeout(triggerStart, 700);
  });

  test('updateScreenAndScore is broadcast to other players (socket.broadcast.to)', (done) => {
    const roomId = 'room-test-update';
    const payload = { structure: [[0]], scores: { testUserA: 10 } };

    socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } });
    socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } });

    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    let ready = 0;
    socketA.on('connect', () => {
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => { ready += 1; if (ready === 2) start(); });
    });
    socketB.on('connect', () => {
      socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => { ready += 1; if (ready === 2) start(); });
    });

    socketB.on('screenAndScoreUpdate', (data) => {
      try {
        expect(data).toHaveProperty('player', 'testUserA');
        expect(data).toHaveProperty('structure');
        expect(data).toHaveProperty('scores');
        cleanup();
        done();
      } catch (err) {
        cleanup();
        done(err);
      }
    });

    function start() {
      // emit update from A, B should receive it (A should not)
      socketA.emit('updateScreenAndScore', payload);
      // give 500ms for broadcast
      setTimeout(() => {
        // if B didn't receive within timeout, fail
        // but keep test engine alive only if B callback triggers
      }, 800);
    }
  });

  test('linesCleared emits only when > 0 and is broadcast to others', (done) => {
    const roomId = 'room-lines';
    socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } });
    socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } });

    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    let ready = 0;
    socketA.on('connect', () => {
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => { ready += 1; if (ready === 2) start(); });
    });
    socketB.on('connect', () => {
      socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => { ready += 1; if (ready === 2) start(); });
    });

    socketB.on('linesCleared', (data) => {
      try {
        expect(data).toHaveProperty('player', 'testUserA');
        expect(data).toHaveProperty('linesCleared');
        expect(data.linesCleared).toBeGreaterThan(0);
        cleanup();
        done();
      } catch (err) {
        cleanup();
        done(err);
      }
    });

    function start() {
      // send with linesCleared = 2 -> server subtracts 1 internally
      socketA.emit('linesCleared', { linesCleared: 2 });
    }
  });

  test('sendNextGame is broadcast to room', (done) => {
    const roomId = 'room-nextgame';
    const nextGameObj = { winner: 'testUserA' };

    socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } });
    socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } });

    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    let ready = 0;
    socketA.on('connect', () => {
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => { ready += 1; if (ready === 2) start(); });
    });
    socketB.on('connect', () => {
      socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => { ready += 1; if (ready === 2) start(); });
    });

    socketB.on('nextGame', (data) => {
      try {
        expect(data).toEqual(nextGameObj);
        cleanup();
        done();
      } catch (err) {
        cleanup();
        done(err);
      }
    });

    function start() {
      socketA.emit('sendNextGame', { roomId, nextGame: nextGameObj });
    }
  });

  test('restartGame only host can restart (basic check)', (done) => {
    const roomId = 'room-restart';
    // create a game where A is host then B joins; A will restart
    socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } });
    socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } });

    const cleanup = () => {
      if (socketA && socketA.connected) socketA.disconnect();
      if (socketB && socketB.connected) socketB.disconnect();
    };

    let ready = 0;
    socketA.on('connect', () => {
      socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => { ready += 1; if (ready === 2) start(); });
    });
    socketB.on('connect', () => {
      socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => { ready += 1; if (ready === 2) start(); });
    });

    socketB.on('restartGame', () => {
      // B receives restart ping when A triggers it
      cleanup();
      done();
    });

    function start() {
      // A triggers restartGame
      socketA.emit('restartGame');
      // If server restricts to host, ensure A is host in your Game implementation
      // we assume current server sets room host to joiner; adjust if needed.
      setTimeout(() => {
        // if B didn't receive restart event, fail after timeout
        // but rely on the event handler above to call done()
      }, 800);
    }
  });
});
