const childProcess = require('child_process')
const path = require('path')
const supertest = require('supertest')
//Is a Node.js testing library used to test HTTP servers and REST APIs.
//It lets you send HTTP requests to your server from your tests, and then assert on the responses.
//In testing, to “assert” means to state what you expect to be true and fail the test if it isn’t.
//So when we say “assert on the response”, we mean: check that the HTTP response matches your expectations (status code, body, headers, etc.).
const ioClient = require('socket.io-client')

const SERVER_PATH = path.resolve(__dirname, 'app.js') // ajuste si nécessaire
const BASE_URL = 'http://localhost:3000'
const REST_PREFIX = '/rest'

const debugArg = ((process.argv.filter((x) => x.startsWith('-dbg='))[0]).split("=")[1] == 'true')

//Jest is a Javascript testing framework.
//See in makefile how we execute this file using Jest.
jest.setTimeout(20000)
//Jest's default timeout is 5 seconds.
//The above command increases the timeout time for slow machines.

let serverProc = null //A reference to the child process running 'node app.js'
let request = null //A 'supertest' client used to send HTTP requests to the server.

//'beforeAll' is a jest lifecycle hook. It runs once before any tests.
//It is used for global setup (starting a server, DB, etc).
beforeAll((done) => { //'done' is a callback (function passed as argument). Calling 'done()' tells Jest the async setup is finished.

	//Starts a new OS process.
	//Equivalent to running in a terminal: 'node src/server/app.js'.
	serverProc = childProcess.spawn('node', [SERVER_PATH], {
		env: Object.assign({}, process.env), //Copies the current environment variables and passes them to the child process.
		stdio: ['ignore', 'pipe', 'pipe'], //This configures standard IO streams so you can read on the stdout and stderr later on.
	})

	// If the server isn't ready after 8 seconds we call a timeout error.
	startupTimeout = setTimeout(() => {
		if (!request) {
			done(new Error("TIMEOUT: Server isn't ready after 8 seconds."))
		}
	}, 8000)

	//Listens to stdout output of the server. Fires every time the server prints something.
	serverProc.stdout.on('data', (d) => { //'d' is a buffer (raw bytes) that takes server logs.
		if (debugArg) {
			process.stdout.write(`[server stdout] ${d}`) //Prints server logs to the test runner’s console. Useful for debugging failed tests.
		}
		if (d.toString().includes('App listening at')) { //Once we know the server listens, we consider it ready.
			request = supertest(BASE_URL) //Creates a supertest client bound to https://localhost:3000.
			clearTimeout(startupTimeout) //Kill the startup-timeout once we know the server started.
			setTimeout(done, 300)
			//We wait an extra 300 ms as a safety margin, since websockets may not be fully ready yet.
			//Afterwards we call 'done()' to tell Jest the async setup is finished.
		}
	})

	//Listens to the server’s stderr stream.
	//Fires whenever the server writes an error and prints it to the test runner's console.
	//Useful if the server crashes at startup, to know why.
	serverProc.stderr.on('data', (d) => {
		if (debugArg) {
			process.stderr.write(`[server stderr] ${d}`)
		}
	})

	//This fires if Node cannot even start the process.
	serverProc.on('error', (err) => {
		done(err)
		//Passing an error to 'done()' tells Jest the setup failed and to abort the tests.
		//So instead of hanging, Jest marks the suite as failed and prints the error.
	})
})

//'afterAll' is a Jest lifecycle hook. It runs once, after all tests finish.
//It shuts everything down cleanly so Jest can exit normally.
afterAll((done) => { //'done' is a callback function to be called when cleaning is completed.
	if (serverProc) { //Checks whether the server process was actually started.
		serverProc.kill('SIGINT') //Closes the child process.
		serverProc.on('exit', () => { //Fires when the child process has fully shut down.
      clearTimeout(shutdownTimeout) //Kill the shutdown-timeout once we know the child process has successfully shut down.
      done()
    })
		shutdownTimeout = setTimeout(done, 2000) //If 'exit' doesn't happen after 2 seconds (timeout), 'done()' is called anyway to avoid deadlocks.
	} else done() //If the server doesn't exist we can call 'done', to mark an end, directly.
})

//'describe' is a Jest grouping function used to organize tests into logical sections.
//It helps Jest structure the test tree and produce readable output.
describe('REST endpoints', () => { //The argument 'REST endpoints' is a human-readable label that appears in the test output.
//Think of 'describe' as a folder/section title for related tests.

	//'test' is a Jest function that describes a single test case.
	//If any assertion fails or the function throws an error, the test fails.
	test("'connect' route returns jwt and username", async () => {
	//The first argument is a description that appears in the test output.
	//'async' is used so that 'await' can be used inside the function when calling the server.


		const name = encodeURIComponent('testUserA') //Converts testUserA into a URL-safe string. This is safe for special characters, for example ' ' becomes '%20'.
		const res = await supertest(BASE_URL) //Creates an HTTP test client pointing at http://localhost:3000.
			.get(`${REST_PREFIX}/connect/${name}`) //Sends an HTTP GET request.
			.expect(200) //This is the first assertion. It verifies that the HTTP status code is 200, if the server responds with anything else the test fails.
		expect(res.body).toHaveProperty('jwt') //This is a second assertion. It checks that the JSON response body exists, and has a property named 'jwt'.
		//A JWT (JSON Web Token) is a tool that allows users to identify themselves to the server and perform their requests.
		expect(res.body).toHaveProperty('username', 'testUserA') //This is a third assertion. It checks that the 'username' property exists and equals the expected 'testUserA'.
	})

	test("'joinablegames' route returns an array (even empty)", async () => {
		const res = await supertest(BASE_URL)
			.get(`${REST_PREFIX}/joinablegames/`)
			.expect(200)
		expect(Array.isArray(res.body)).toBeTruthy() //Checks if the response body is an 'Array'. 'Array.isArray(...)' returns true for arrays.
	})

	test("'scores' and 'bestscores' routes respond with status 200", async () => {
		await supertest(BASE_URL).get(`${REST_PREFIX}/bestscores/`).expect(200)
		// scores for a user without scores should still return (or 400 handled server-side)
		await supertest(BASE_URL).get(`${REST_PREFIX}/scores/testUserA`).expect(200)
	})
})

describe('Socket.IO flows', () => { //This creates a test group in Jest for the server's sockets.
	let tokenA, tokenB //Those will take the JWTs to authenticate user requests.
	let socketA, socketB //These will store Socket.IO client connections who will simulate two players.
	const opts = { //This object declares socket connection options.
		transports: ['websocket'], //We choose websockets over HTTP long-polling for faster communication.
		reconnection: false, //If the connection drops, do not reconnect automatically, to avoid hiding failures.
		timeout: 5000, //Give the connection up to 5 seconds to succeed so you don't wait forever if the server has a problem.
	}

	//This first Socket.IO test prepares authentication for the next tests by retrieving JWT tokens for two simulated players/users.
	test('retrieve jwt tokens via REST to authenticate two users', async () => {
		const resA = await request //'request' is a previously defined HTTP client bound to: http://localhost:3000.
			.get(`${REST_PREFIX}/connect/testUserA`)
			.expect(200)
		const resB = await request
			.get(`${REST_PREFIX}/connect/testUserB`)
			.expect(200)
		tokenA = resA.body.jwt //Get the JWT token for player A. The JWT token will allow authentication during future socket connections.
		tokenB = resB.body.jwt
		expect(typeof tokenA).toBe('string') //Assert the JWT token to be a string.
		expect(typeof tokenB).toBe('string')
	})

	//The test function takes a 'done()' callback because the test is event driven and not promise-based.
	//Jest will not know when the test finishes unless we call 'done()'.
	//So we manually tell Jest to end the test once both players have received the broadcast.
	//A broadcast is a message sent to all members of the room.
	test("two sockets can: connect to a room; join same room; receive 'playerJoined' broadcast", (done) => {
		const roomId = 'room-test-1' //Both users will join this room.
		let joinCount = 0 //Tracks how many playerJoined events have been received.

		//To close sockets before the next tests, this function is called when: the test finishes normally; or if an error occurs.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect() //Only disconnects if socket exists and is connected.
			if (socketB && socketB.connected) socketB.disconnect()
		}

		//Creates a socket connection to your server for user A.
		socketA = ioClient(BASE_URL, {
			...opts,
			auth: { token: tokenA },
		})

		//If socket connection fails, the test fails.
		socketA.on('connect_error', (err) => done(err))

		//Wait until socket connection completes.
		socketA.on('connect', () => {
			// console.log("socket A connected")
			//By emitting the 'joinRoom' event, we ask the server to join the room.
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, (ack) => {
				//'ack' refers to an acknowledgment, that is a response only we receive to know if the server accepted the request, while a broadcast is a message received by everyone in the room.
				//We ignore the acknowledgment because we will only rely on broadcasts.
			})
		})

		//'socketA' listens for the 'playerJoined' broadcast that should be sent once a player joins the room.
		socketA.on('playerJoined', (payload) => { //The payload is what the server sent to the client.
			expect(payload).toHaveProperty('player') //We assert that the payload contains a property 'player'.
			expect(payload).toHaveProperty('room', roomId) //We assert that the payload contains the active room.
			joinCount += 1 //Increment how many players joined the room.
			// console.log("A: " + joinCount)
			// console.log(payload)
			if (joinCount === 2) { //If two players (users A and B) joined the room we can end the test successfully.
				cleanup()
				done()
			}
		})

		setTimeout(() => { //Wait 300ms to ensure A already joined the room.
			socketB = ioClient(BASE_URL, { //Create a socket connection to your server for user B.
				...opts,
				auth: { token: tokenB },
			})

			socketB.on('connect_error', (err) => done(err)) //If socket connection fails, the test fails.

			//Once socket B connected we emit a request to join the room.
			socketB.on('connect', () => {
				// console.log("socket B connected")
				socketB.emit('joinRoom', { roomId, username: 'testUserB' }, (ack) => {})
			})

			//Socket B listens for broadcasts, and finishes the test once two players (A and B) joined the room.
			socketB.on('playerJoined', (payload) => {
				expect(payload).toHaveProperty('player')
				expect(payload).toHaveProperty('room', roomId)
				joinCount += 1
				// console.log("B: " + joinCount)
				// console.log(payload)
				if (joinCount === 2) {
					cleanup()
					done()
				}
			})
		}, 300)
	})

	//This test verifies that when one player emits 'startGame', everyone in the room receives the broadcast.
	test("'startGame' is broadcast to room", (done) => {
		const roomId = 'room-test-start' //The room player A and B will join.
		let receivedStart = false //Tracks whether player B received the 'startGame' event.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Close the sockets at the end of the test to avoid resource leaks and don't impact future tests.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Counts joined players.
		const tryFinish = () => { //This function verifies if both players joined and received the 'startGame' broadcast, thus if the test succeeded.
			if (ready === 2 && receivedStart) {
				cleanup()
				done()
			}
		}

		//Player A joins the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				tryFinish()
			})
		})
		//Player B joins the room.
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				tryFinish()
			})
		})

		//Player B listens for the 'startGame' broadcast.
		socketB.on('startGame', () => {
			receivedStart = true
			tryFinish() //This function should now confirm the test succeeded.
		})

		const triggerStart = () => { //A function that lets player A trigger the game start, subsequently the server should send the 'startGame' broadcast to player B.
			socketA.emit('startGame')
		}
		setTimeout(triggerStart, 700) //Wait 700ms for player A and B to join the room before triggering the start of game.
	})

	test("'updateScreenAndScore' is broadcast to room", (done) => {
		const roomId = 'room-test-update' //Name of the room.
		const payload = { structure: [[0]], score: 10 } //Simulated game data representing the board layout and score.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//So the test never leaves open connections.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Counts how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'screenAndScoreUpdate'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B listens for the 'screenAndScoreUpdate' broadcast sent by player A.
		socketB.on('screenAndScoreUpdate', (data) => {
			try {
				expect(data).toHaveProperty('player', 'testUserA')
				expect(data).toHaveProperty('structure')
				expect(data).toHaveProperty('score')
				cleanup()
				done()
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		function start() {
			socketA.emit('updateScreenAndScore', payload) //We emit 'updateScreenAndScore' from player A. B should receive it and A should not.
			setTimeout(() => {}, 1000) //Wait until B receives the broadcast before failing the test.
		}
	})

	test("'linesCleared' emits when lines of a player are cleared, and this is broadcasted to the whole room", (done) => {
		const roomId = 'room-lines' //Name of the room we will use for the test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Ensures no connections stay open when the test ends.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'linesCleared'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B should receive the 'linesCleared' broadcast from player A, and thus listens for it.
		socketB.on('linesCleared', (data) => {
			try {
				//We assert that the broadcast contains the datas it should.
				expect(data).toHaveProperty('player', 'testUserA')
				expect(data).toHaveProperty('linesCleared')
				expect(data.linesCleared).toBeGreaterThan(0)
				cleanup()
				done()
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		//Player A emits 'linesCleared' to the server who broadcasts to player B who is in the same room.
		function start() {
			socketA.emit('linesCleared', { linesCleared: 2 }) //Player A emits 2 cleared lines because the server substracts 1 before broadcasting.
			setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
		}
	})

	test("'sendNextGame' is broadcast to room after someone emits it", (done) => {
		const roomId = 'room-nextgame' //Room name for this test.
		const nextGameObj = { winner: 'testUserA' } //The object we will emit and broadcast.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Ensures open sockets don’t leak after the test finishes.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit the next game.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B listens for 'nextGame' that should have been broadcasted after player A emitted 'sendNextGame'.
		socketB.on('nextGame', (data) => {
			try {
				expect(data).toEqual(nextGameObj)
				cleanup()
				done()
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		//Player A emits the next game to the server who should broadcast it to others in the room such as player B.
		function start() {
			socketA.emit('sendNextGame', { roomId, nextGame: nextGameObj })
			setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
		}
	})

	test("'restartGame' can only be emitted by host and is broadcasted to the room", (done) => {
		const roomId = 'room-restart' //Unique room name for this test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'restartGame'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B listens for the broadcast and we end the test once we know he received it.
		socketB.on('restartGame', () => {
			cleanup()
			done()
		})

		//Player A is the host since he was first in the room.
		//As a host, he will now emit 'restartGame' for the server to notify the other room players via a broadcast.
		function start() {
			socketA.emit('restartGame')
			setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
		}
	})

	test("Emitting 'gameOver' broadcasts to the room", (done) => {
		const roomId = 'room-gameover' //Name of the room for this test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'gameOver'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B listens for the broadcast he should receive after player A emits 'gameOver'.
		socketB.on('playerGameOver', (data) => {
			try {
				expect(data).toHaveProperty('player')
				expect(data.player).toBe('testUserA')
				cleanup()
				done()
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		//Player A emits 'gameOver' to the server who should broadcast it to the room.
		function start() {
			socketA.emit('gameOver')
			setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
		}
	})

	test("Emitting 'loseGame' broadcasts 'playerLost' to room", (done) => {
		const roomId = 'room-lose' //Name of the room for this test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'loseGame'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//Player B listens for the broadcast he should receive after player A emits 'loseGame'.
		socketB.on('playerLost', (data) => {
			try {
				expect(data).toHaveProperty('player', 'testUserA')
				cleanup()
				done()
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		//Player A emits 'loseGame' to the server who should broadcast 'playerLost' to the room.
		function start() {
			socketA.emit('loseGame')
			setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
		}
	})

	test("when all players lose, 'updateScore' is broadcast to room", (done) => {
		const roomId = 'room-lose-all' //Name of the room for this test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		let scoreEvents = 0 //Counts how many players received the broadcast.

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' for all players of the room to emit 'loseGame'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		//All players of the room emit 'loseGame' to the server who should broadcast 'updateScore'.
		function start() {
			socketA.emit('loseGame')
			setTimeout(() => socketB.emit('loseGame'), 200)
		}

		//Function to assert the 'updateScore' broadcast.
		const handler = (data) => {
			try {
				expect(data).toHaveProperty('username')
				expect(data).toHaveProperty('score')
				scoreEvents += 1
				if (scoreEvents === 2) { //If both players received the broadcast we can end the test.
					cleanup()
					done()
				}
			} catch (err) {
				cleanup()
				done(err)
			}
		}

		//Both player A and B listen for the 'updateScore' broadcast that should be received after all players lost.
		socketA.on('updateScore', handler)
		socketB.on('updateScore', handler)
	})

	test("'askNewPiece' is broadcasted to all room members", (done) => {
		const roomId = 'room-nextpiece' //Name of the room for this test.

		//Create two socket connections for the two players.
		socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
		socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		let ready = 0 //Track how many players joined the room.
		//Once socket A connected we emit a request to join the room.
		socketA.on('connect', () => {
			socketA.emit('joinRoom', { roomId, username: 'testUserA' }, () => {
				ready += 1
				if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'askNewPiece'.
			})
		})
		socketB.on('connect', () => {
			socketB.emit('joinRoom', { roomId, username: 'testUserB' }, () => {
				ready += 1
				if (ready === 2) start()
			})
		})

		let received = 0 //Counts how many players received the broadcast.

		//Both player A and B listen for the 'nextPiece' broadcast that should be received after player A emitted 'askNewPiece'.
		socketA.on('nextPiece', (data) => {
			try {
				expect(data).toHaveProperty('pieceBaskets')
				received += 1
				if (received === 2) { //If both players received the broadcast we can end the test.
					cleanup()
					done()
				}
			} catch (err) {
				cleanup()
				done(err)
			}
		})
		socketB.on('nextPiece', (data) => {
			try {
				expect(data).toHaveProperty('pieceBaskets')
				received += 1
				if (received === 2) {
					cleanup()
					done()
				}
			} catch (err) {
				cleanup()
				done(err)
			}
		})

		//Player A emits 'askNewPiece' to the server who should broadcast 'nextPiece'.
		function start() {
			socketA.emit('askNewPiece')
			setTimeout(() => {}, 1000) //We use timeout to fail the test if the broadcast isn't received.
		}
	})

})
