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

//Jest is a Javascript testing framework.
//See in makefile how we execute this file using Jest.
jest.setTimeout(20000)
//Jest's default timeout is 5 seconds.
//The above command increases the timeout time for slow machines.

//'app.js' and the classes it uses log a lot via 'console.log' (and the client redux slices log some
//expected failure paths via 'console.error'/'console.warn', e.g. a rejected 'joinRoom' or a socket
//disconnect), for use when running the app normally. Now that the server runs inside this same Jest
//process (see below), those calls would otherwise flood the test output. Pass '-dbg=true' to see them again.
const debugArg =
	(process.argv.filter((x) => x.startsWith('-dbg='))[0] || '').split('=')[1] ===
	'true'
if (!debugArg) {
	console.log = () => {}
	console.error = () => {}
	console.warn = () => {}
}

//Requiring the server directly (instead of spawning 'node app.js' as a separate OS process) makes it
//run inside this same Jest process, so Jest's coverage instrumentation can actually see the code in
//'app.js' and everything it requires (the 'classes' files, 'manageDatabase.js') execute.
const { server, db, pendingDisconnects } = require(SERVER_PATH)
let request = null //A 'supertest' client used to send HTTP requests to the server.

//The server classes 'app.js' itself is built on top of. Requiring them directly (instead of only going
//through 'app.js') lets us unit-test their logic (piece/player bookkeeping, DB persistence, username
//validation) without needing a socket or HTTP round-trip for every case.
const { Game } = require('./classes/Game.js')
const { Player } = require('./classes/Player.js')
const { User } = require('./classes/User.js')
const { Utils } = require('./classes/Utils.js')
const { Piece } = require('./classes/Piece.js')

//The client (React/Redux) side of the app. It's plain ES modules + JSX, transpiled for Jest by
//'babel.config.js' (the same config webpack uses to bundle it for the browser). None of the files
//below need a DOM, so they run fine in this file's default 'node' test environment - only the
//'*.css'/font/image-free presentational components in 'sharedComponents.test.js' need the 'jsdom'
//environment (and thus live in their own file - see the comment at the top of that file for why).
const { configureStore } = require('@reduxjs/toolkit')

const authSlice = require('../client/redux/slices/authSlice').default
const { userConnect } = require('../client/redux/slices/authSlice')

const gameTimeSlice = require('../client/redux/slices/gameTimeSlice').default
const {
	startGame,
	endGame,
	updateGameTime,
	pauseGame,
	resumeGame,
} = require('../client/redux/slices/gameTimeSlice')

const gameplaySlice = require('../client/redux/slices/gameplaySlice').default
const {
	setGrid,
	setPiecePosition,
	setScore,
	resetGameplay,
	resetGameplayAndScore,
	EmitGridAndScore,
	resetGameplayAndEmit,
} = require('../client/redux/slices/gameplaySlice')

const opponentsSlice = require('../client/redux/slices/opponentsSlice').default
const {
	setOpponentGridAndScore,
	removeOpponent,
	resetAllOpponents,
} = require('../client/redux/slices/opponentsSlice')

const pieceSlice = require('../client/redux/slices/pieceSlice').default
const {
	incrementIndex,
	removeCurrentPiece,
	incrementIndexFun,
} = require('../client/redux/slices/pieceSlice')

const roomSlice = require('../client/redux/slices/roomSlice').default
const {
	setPlayers,
	setRoomId,
	playerJoined,
	playerLeft,
	gameStarted,
	setNewHost,
	joinRoomThunk,
} = require('../client/redux/slices/roomSlice')

const socketSlice = require('../client/redux/slices/socketSlice').default
const {
	socketConnected,
	socketConnectionFailed,
	socketDisconnected,
	socketConnectThunk,
} = require('../client/redux/slices/socketSlice')

const httpApi = require('../client/api/http.api')
const socketApiClient = require('../client/api/socket.api')

const { CELL_COLORS } = require('../client/utils/cellColors')
const {
	PIECE_STARTING_ORIENTATIONS,
} = require('../client/utils/pieceStartingOrientation')
const { PIECES_COLOR_CODES } = require('../client/utils/piecesColorCodes')
const { TETROMINOS } = require('../client/utils/tetrominoes')
const { WALL_KICK_OFFSETS } = require('../client/utils/wallKickOffsets')

//Same purpose as the 'authenticate'/'usernameFor' helpers used further down by the 'Socket.IO flows'
//tests, just hoisted to file scope so the new client/server describe blocks below can reuse them too.
const authenticate = (username) =>
	request
		.get(`${REST_PREFIX}/connect/${encodeURIComponent(username)}`)
		.expect(200)
		.then((res) => res.body.jwt)

const usernameFor = (roomId, suffix) =>
	`${roomId.replace(/[^a-zA-Z0-9]/g, '')}${suffix}`

//A couple of the redux tests below store a real (or fake) socket directly in the store, same as the
//real 'store.js' does - sockets aren't plain serializable data, so this mirrors 'store.js's own
//'serializableCheck: false' middleware option to avoid a (harmless but noisy) console warning.
const makeStore = (reducer) =>
	configureStore({
		reducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({ serializableCheck: false }),
	})

//'beforeAll' is a jest lifecycle hook. It runs once before any tests.
//It is used for global setup (starting a server, DB, etc).
beforeAll((done) => {
	//'done' is a callback (function passed as argument). Calling 'done()' tells Jest the async setup is finished.
	const onListening = () => {
		request = supertest(BASE_URL) //Creates a supertest client bound to https://localhost:3000.
		done()
	}
	if (server.listening) {
		//'app.js' may already be done binding the port by the time this hook runs.
		onListening()
	} else {
		server.once('listening', onListening)
	}
})

//'afterAll' is a Jest lifecycle hook. It runs once, after all tests finish.
//It shuts everything down cleanly so Jest can exit normally.
afterAll((done) => {
	//'done' is a callback function to be called when cleaning is completed.
	server.close(() => {
		//Stops accepting new connections and waits for existing ones to close.
		//The last test's socket disconnects can still be writing to the DB (see 'pendingDisconnects' in
		//app.js) when this runs, so wait for that to finish before closing the pool it uses.
		Promise.all(pendingDisconnects)
			.then(() => db.close_connection())
			.then(done, done)
	})
})

//'describe' is a Jest grouping function used to organize tests into logical sections.
//It helps Jest structure the test tree and produce readable output.
describe('REST endpoints', () => {
	//The argument 'REST endpoints' is a human-readable label that appears in the test output.
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

describe('Socket.IO flows', () => {
	//This creates a test group in Jest for the server's sockets.
	let socketA, socketB //These will store Socket.IO client connections who will simulate two players.
	const opts = {
		//This object declares socket connection options.
		transports: ['websocket'], //We choose websockets over HTTP long-polling for faster communication.
		reconnection: false, //If the connection drops, do not reconnect automatically, to avoid hiding failures.
		timeout: 5000, //Give the connection up to 5 seconds to succeed so you don't wait forever if the server has a problem.
	}

	//'authenticate'/'usernameFor' are defined once at file scope (see near the top of this file) since
	//other describe blocks below (client/server unit tests) need them too. Each test still authenticates
	//its own pair of usernames (derived from its own unique roomId) instead of reusing
	//'testUserA'/'testUserB' everywhere: the server only allows one active socket connection per username
	//at a time (see 'activeUsers' in app.js), and disconnecting a socket doesn't instantly free that
	//username server-side (it's freed once the server finishes processing its own 'disconnect' event).
	//Reusing the same username across tests raced against that server-side cleanup, occasionally
	//rejecting the next test's connection. Unique usernames per test remove that race entirely.

	//The test function takes a 'done()' callback because the test is event driven and not promise-based.
	//Jest will not know when the test finishes unless we call 'done()'.
	//So we manually tell Jest to end the test once both players have received the broadcast.
	//A broadcast is a message sent to all members of the room.
	test("two sockets can: connect to a room; join same room; receive 'playerJoined' broadcast", (done) => {
		const roomId = 'room-test-1' //Both users will join this room.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		let joinCount = 0 //Tracks how many playerJoined events have been received.

		//To close sockets before the next tests, this function is called when: the test finishes normally; or if an error occurs.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		authenticate(userA)
			.then((tokenA) => {
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
					socketA.emit('joinRoom', { roomId, username: userA }, (ack) => {
						//'ack' refers to an acknowledgment, that is a response only we receive to know if the server accepted the request, while a broadcast is a message received by everyone in the room.
						//We ignore the acknowledgment because we will only rely on broadcasts.
					})
				})

				//'socketA' listens for the 'playerJoined' broadcast that should be sent once a player joins the room.
				socketA.on('playerJoined', (payload) => {
					//The payload is what the server sent to the client.
					expect(payload).toHaveProperty('player') //We assert that the payload contains a property 'player'.
					expect(payload).toHaveProperty('room', roomId) //We assert that the payload contains the active room.
					joinCount += 1 //Increment how many players joined the room.
					// console.log("A: " + joinCount)
					// console.log(payload)
					if (joinCount === 2) {
						//If two players (users A and B) joined the room we can end the test successfully.
						cleanup()
						done()
					}
				})

				setTimeout(() => {
					//Wait 300ms to ensure A already joined the room.
					authenticate(userB)
						.then((tokenB) => {
							socketB = ioClient(BASE_URL, {
								//Create a socket connection to your server for user B.
								...opts,
								auth: { token: tokenB },
							})

							socketB.on('connect_error', (err) => done(err)) //If socket connection fails, the test fails.

							//Once socket B connected we emit a request to join the room.
							socketB.on('connect', () => {
								// console.log("socket B connected")
								socketB.emit(
									'joinRoom',
									{ roomId, username: userB },
									(ack) => {}
								)
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
						})
						.catch(done)
				}, 300)
			})
			.catch(done)
	})

	//This test verifies that when one player emits 'startGame', everyone in the room receives the broadcast,
	//along with the fresh piece basket 'restartGame' just generated server-side.
	test("'startGame' is broadcast to room, along with a fresh piece basket", (done) => {
		const roomId = 'room-test-start' //The room player A and B will join.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		let receivedStart = false //Tracks whether player B received the 'startGame' event.

		//Close the sockets at the end of the test to avoid resource leaks and don't impact future tests.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Counts joined players.
				const tryFinish = () => {
					//This function verifies if both players joined and received the 'startGame' broadcast, thus if the test succeeded.
					if (ready === 2 && receivedStart) {
						cleanup()
						done()
					}
				}

				//Player A joins the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						tryFinish()
					})
				})
				//Player B joins the room.
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						tryFinish()
					})
				})

				//Player B listens for the 'startGame' broadcast.
				socketB.on('startGame', (data) => {
					expect(Array.isArray(data.pieceBasket)).toBe(true)
					expect(data.pieceBasket.length).toBeGreaterThan(0)
					receivedStart = true
					tryFinish() //This function should now confirm the test succeeded.
				})

				const triggerStart = () => {
					//A function that lets player A trigger the game start, subsequently the server should send the 'startGame' broadcast to player B.
					socketA.emit('startGame')
				}
				setTimeout(triggerStart, 700) //Wait 700ms for player A and B to join the room before triggering the start of game.
			})
			.catch(done)
	})

	test("'updateScreenAndScore' is broadcast to room", (done) => {
		const roomId = 'room-test-update' //Name of the room.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		const payload = { structure: [[0]], score: 10 } //Simulated game data representing the board layout and score.

		//So the test never leaves open connections.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Counts how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'screenAndScoreUpdate'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//Player B listens for the 'screenAndScoreUpdate' broadcast sent by player A.
				socketB.on('screenAndScoreUpdate', (data) => {
					try {
						expect(data).toHaveProperty('player', userA)
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
			.catch(done)
	})

	test("'linesCleared' emits when lines of a player are cleared, and this is broadcasted to the whole room", (done) => {
		const roomId = 'room-lines' //Name of the room we will use for the test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Ensures no connections stay open when the test ends.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'linesCleared'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//Player B should receive the 'linesCleared' broadcast from player A, and thus listens for it.
				socketB.on('linesCleared', (data) => {
					try {
						//We assert that the broadcast contains the datas it should.
						expect(data).toHaveProperty('player', userA)
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
			.catch(done)
	})

	test("'sendNextGame' is broadcast to room after someone emits it", (done) => {
		const roomId = 'room-nextgame' //Room name for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		const nextGameObj = { winner: userA } //The object we will emit and broadcast.

		//Ensures open sockets don’t leak after the test finishes.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit the next game.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
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
			.catch(done)
	})

	test("'restartGame' can only be emitted by host and is broadcasted to the room", (done) => {
		const roomId = 'room-restart' //Unique room name for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' to emit 'restartGame'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
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
			.catch(done)
	})

	test("Emitting 'gameOver' broadcasts to the room", (done) => {
		const roomId = 'room-gameover' //Name of the room for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'gameOver'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//Player B listens for the broadcast he should receive after player A emits 'gameOver'.
				socketB.on('playerGameOver', (data) => {
					try {
						expect(data).toHaveProperty('player')
						expect(data.player).toBe(userA)
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
			.catch(done)
	})

	test("Emitting 'looseGame' broadcasts 'playerLost' to room", (done) => {
		const roomId = 'room-lose' //Name of the room for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'looseGame'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//Player B listens for the broadcast he should receive after player A emits 'looseGame'.
				socketB.on('playerLost', (data) => {
					try {
						expect(data).toHaveProperty('player', userA)
						cleanup()
						done()
					} catch (err) {
						cleanup()
						done(err)
					}
				})

				//Player A emits 'looseGame' to the server who should broadcast 'playerLost' to the room.
				function start() {
					socketA.emit('looseGame')
					setTimeout(() => {}, 1000) //We use timeout to fail the test if B doesn't receive the broadcast.
				}
			})
			.catch(done)
	})

	test("leaving a started room mid-match persists the departing player's score even though another player remains (regression: the multiplayer persistence gap - previously a player's score only got saved once EVERY player had left)", (done) => {
		const roomId = 'room-leave-persist'
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //A joined first, so A is the host and starts the game.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				function start() {
					socketA.emit('startGame') //Locks the room - see 'Game.locked' in app.js's 'leaveRoom'.
					setTimeout(() => {
						socketA.emit('updateScreenAndScore', {
							structure: Array(20)
								.fill()
								.map(() => Array(10).fill(0)),
							score: 77,
						})
						setTimeout(() => {
							//A leaves while B is still connected and in the room (room stays non-empty), then
							//waits for the server's ack before checking the DB - see socket.api.js/app.js.
							socketA.emit('leaveRoom', () => {
								db.query(
									'SELECT score FROM player WHERE username = $1 AND game_id = $2',
									[userA, roomId]
								)
									.then((result) => {
										try {
											expect(result.rows[0]).toMatchObject({ score: 77 })
											cleanup()
											done()
										} catch (err) {
											cleanup()
											done(err)
										}
									})
									.catch((err) => {
										cleanup()
										done(err)
									})
							})
						}, 100)
					}, 100)
				}
			})
			.catch(done)
	})

	test("when all players lose, 'updateScore' is broadcast to room", (done) => {
		const roomId = 'room-lose-all' //Name of the room for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		let scoreEvents = 0 //Counts how many players received the broadcast.

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' for all players of the room to emit 'looseGame'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//All players of the room emit 'looseGame' to the server who should broadcast 'updateScore'.
				function start() {
					socketA.emit('looseGame')
					setTimeout(() => socketB.emit('looseGame'), 200)
				}

				//Function to assert the 'updateScore' broadcast.
				const handler = (data) => {
					try {
						expect(data).toHaveProperty('username')
						expect(data).toHaveProperty('score')
						scoreEvents += 1
						if (scoreEvents === 2) {
							//If both players received the broadcast we can end the test.
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
			.catch(done)
	})

	test("when every other player leaves, the remaining player is declared the winner via 'updateScore'", (done) => {
		const roomId = 'room-leave-winner' //Name of the room for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //Once both A and B joined, B leaves so A should be declared the winner.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
						ready += 1
						if (ready === 2) start()
					})
				})

				//Player A listens for the 'updateScore' broadcast that should be received after B leaves.
				socketA.on('updateScore', (data) => {
					try {
						expect(data).toHaveProperty('username', userA)
						expect(data).toHaveProperty('isGameOver', true)
						cleanup()
						done()
					} catch (err) {
						cleanup()
						done(err)
					}
				})

				//Player B leaves the room, which should leave A alone and thus the winner.
				function start() {
					socketB.emit('leaveRoom')
					setTimeout(() => {}, 1000) //We use timeout to fail the test if A doesn't receive the broadcast.
				}
			})
			.catch(done)
	})

	test("'askNewPiece' is broadcasted to all room members", (done) => {
		const roomId = 'room-nextpiece' //Name of the room for this test.
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')

		//Prevents socket leaks.
		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}

		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				//Create two socket connections for the two players.
				socketA = ioClient(BASE_URL, { ...opts, auth: { token: tokenA } })
				socketB = ioClient(BASE_URL, { ...opts, auth: { token: tokenB } })

				//If either socket connection fails, the test fails.
				socketA.on('connect_error', (err) => done(err))
				socketB.on('connect_error', (err) => done(err))

				let ready = 0 //Track how many players joined the room.
				//Once socket A connected we emit a request to join the room.
				socketA.on('connect', () => {
					socketA.emit('joinRoom', { roomId, username: userA }, () => {
						ready += 1
						if (ready === 2) start() //If both player A and B joined, we call 'start()' for player A to emit 'askNewPiece'.
					})
				})
				socketB.on('connect', () => {
					socketB.emit('joinRoom', { roomId, username: userB }, () => {
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
						if (received === 2) {
							//If both players received the broadcast we can end the test.
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
			.catch(done)
	})
})

//'app.js' is a thin layer of routes/socket handlers on top of the classes below (Game/Player/User/Utils)
//and 'manageDatabase.js'. The 'REST endpoints'/'Socket.IO flows' describes above already exercise most
//of that logic indirectly through HTTP/socket calls, but this describe tests the classes directly so
//edge cases (game full, host reassignment, invalid usernames, DB persistence) don't each need a full
//HTTP or socket round-trip to cover.
describe('Server classes (Game, Player, User, Utils, database)', () => {
	describe('Game', () => {
		test('addPlayer accepts up to 4 players, then rejects a 5th and rejects duplicate usernames', () => {
			const game = new Game('unit-game-1')
			expect(game.addPlayer('p1')).toBe(game) //On success 'addPlayer' returns the game itself (truthy).
			game.addPlayer('p2')
			game.addPlayer('p3')
			game.addPlayer('p4')
			expect(game.players).toHaveLength(4)
			expect(game.addPlayer('p5')).toBe(false) //Game is full (MAX_PLAYERS = 4).
			expect(game.addPlayer('p1')).toBe(false) //Duplicate username.
		})

		test('addPlayer refuses to add players once the game is locked', () => {
			const game = new Game('unit-game-2')
			game.lockGame()
			expect(game.locked).toBe(true)
			expect(game.addPlayer('p1')).toBe(false)
		})

		test('restartGame resets round state but does not unlock the game (regression: a started/finished game must stay out of "active rooms" instead of reappearing as joinable)', () => {
			const game = new Game('unit-game-2b')
			game.addPlayer('p1')
			game.lockGame()
			game.players[0].score = 42
			game.players[0].hasLost = true
			game.restartGame()
			expect(game.locked).toBe(true) //Locking is owned by the caller (see 'startGame' in app.js); restarting a round must not silently reopen the room.
			expect(game.players[0].score).toBe(0)
			expect(game.players[0].hasLost).toBe(false)
		})

		test('removePlayer reassigns the host to the next player, and marks the game finished once empty', () => {
			const game = new Game('unit-game-3', false, false, 'host')
			game.addPlayer('host')
			game.addPlayer('guest')
			expect(game.removePlayer('host')).toBe(game)
			expect(game.host).toBe('guest') //Host reassigned to the remaining player.
			expect(game.finished).toBe(false)
			game.removePlayer('guest')
			expect(game.finished).toBe(true) //No players left -> the game is over.
			expect(game.removePlayer('nobody')).toBe(false)
		})

		test('playerLost / allPlayersLost track which players have lost', () => {
			const game = new Game('unit-game-4')
			game.addPlayer('a')
			game.addPlayer('b')
			expect(game.allPlayersLost()).toBe(false)
			expect(game.playerLost('nobody')).toBe(false)
			game.playerLost('a')
			expect(game.allPlayersLost()).toBe(false)
			game.playerLost('b')
			expect(game.allPlayersLost()).toBe(true)
		})

		test('toJSON exposes id, locked, finished, host, pieceBasket and players', () => {
			const game = new Game('unit-game-5', false, false, 'host')
			game.addPlayer('host')
			const json = game.toJSON()
			expect(json).toMatchObject({
				id: 'unit-game-5',
				locked: false,
				finished: false,
				host: 'host',
			})
			expect(Array.isArray(json.pieceBasket)).toBe(true)
			expect(json.players).toEqual([
				{ username: 'host', game_id: 'unit-game-5', score: 0 },
			])
		})

		test("socket getter returns each player's live socket, and display() summarizes the game as a string", () => {
			const fakeSocket = { id: 'fake-socket-1' }
			const game = new Game('unit-game-display', false, false, 'host')
			game.addPlayer('host', fakeSocket)
			expect(game.socket).toEqual([fakeSocket])

			const summary = game.display()
			expect(typeof summary).toBe('string')
			expect(summary).toContain('unit-game-display')
		})

		test('setDB/endGame persist the game and its historical players to the real database', async () => {
			const hostUsername = 'unithostgame'
			const gameId = 'unit-game-db'
			//The 'game' table's host column, and the 'player' table's username column, are foreign keys
			//referencing 'account(username)' (see 'designDatabase.sql'), so the account must exist first.
			await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT DO NOTHING',
				[hostUsername]
			)

			const game = new Game(gameId, false, false, hostUsername)
			game.addPlayer(hostUsername)
			await game.endGame(db) //Marks the game finished, then calls 'setDB' internally.
			expect(game.finished).toBe(true)

			const gameRow = await db.query('SELECT * FROM game WHERE id = $1', [
				gameId,
			])
			expect(gameRow.rows[0]).toMatchObject({
				id: gameId,
				finished: true,
				host: hostUsername,
			})

			const playerRow = await db.query(
				'SELECT * FROM player WHERE game_id = $1',
				[gameId]
			)
			expect(playerRow.rows[0]).toMatchObject({
				username: hostUsername,
				game_id: gameId,
				score: 0,
			})
		})

		test("setDB can be called more than once for the same room without throwing, and keeps each player's latest score (regression: the multiplayer persistence gap - 'setDB' is now called once per round/leave, not just once ever)", async () => {
			const hostUsername = 'unithostgame2'
			const gameId = 'unit-game-db-multi'
			await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT DO NOTHING',
				[hostUsername]
			)

			const game = new Game(gameId, false, false, hostUsername)
			game.addPlayer(hostUsername)
			game.lockGame() //Simulates a started room, same as 'startGame' does in app.js.
			game.players[0].score = 10
			await game.setDB(db) //First sync, e.g. as soon as this player's round ends.

			game.players[0].score = 42
			await expect(game.setDB(db)).resolves.toBe(game) //Second sync, e.g. once this player leaves.

			const playerRow = await db.query(
				'SELECT * FROM player WHERE username = $1 AND game_id = $2',
				[hostUsername, gameId]
			)
			expect(playerRow.rows[0]).toMatchObject({ score: 42 }) //Latest score wins, no duplicate-key error.

			const gameRow = await db.query('SELECT * FROM game WHERE id = $1', [
				gameId,
			])
			expect(gameRow.rows).toHaveLength(1) //Still exactly one 'game' row for this room id.
		})
	})

	describe('Player', () => {
		test('constructor sets sane defaults, and getters/setters work', () => {
			const player = new Player('alice', 'room1')
			expect(player.username).toBe('alice')
			expect(player.game_id).toBe('room1')
			expect(player.score).toBe(0)
			expect(player.hasLost).toBe(false)
			player.score = 42
			player.hasLost = true
			expect(player.score).toBe(42)
			expect(player.hasLost).toBe(true)
		})

		test('toJSON only exposes username, game_id and score (not the socket or hasLost)', () => {
			const player = new Player('bob', 'room2', 7)
			expect(player.toJSON()).toEqual({
				username: 'bob',
				game_id: 'room2',
				score: 7,
			})
		})

		test("socket getter/setter store the player's live connection", () => {
			const player = new Player('carol', 'room3')
			expect(player.socket).toBeNull() //No socket passed to the constructor.
			const fakeSocket = { id: 'fake-socket-2' }
			player.socket = fakeSocket
			expect(player.socket).toBe(fakeSocket)
		})

		test('setDB inserts the player row into the real database and returns itself', async () => {
			const username = 'unitplayerdb'
			const gameId = 'unit-game-player-db'
			//Same foreign-key requirement as above: the account and the game must already exist.
			await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT DO NOTHING',
				[username]
			)
			await db.query(
				'INSERT INTO game (id, locked, finished, host) VALUES ($1, false, false, $2) ON CONFLICT DO NOTHING',
				[gameId, username]
			)

			const player = new Player(username, gameId, 9)
			const result = await player.setDB(db)
			expect(result).toBe(player)

			const row = await db.query(
				'SELECT * FROM player WHERE username = $1 AND game_id = $2',
				[username, gameId]
			)
			expect(row.rows[0]).toMatchObject({ username, game_id: gameId, score: 9 })
		})
	})

	describe('Piece', () => {
		test('displayPiece logs without throwing', () => {
			const piece = new Piece()
			expect(() => piece.displayPiece()).not.toThrow()
		})
	})

	describe('User', () => {
		test('connect rejects usernames longer than 19 characters', async () => {
			const user = new User()
			await expect(user.connect(db, 'a'.repeat(20))).rejects.toThrow(
				"Player's username is too long"
			)
		})

		test('connect rejects usernames containing special characters', async () => {
			const user = new User()
			await expect(user.connect(db, 'bad name!')).rejects.toThrow(
				"Player's username contains special characters"
			)
		})

		test('connect creates a new account, and connecting again with the same username does not throw', async () => {
			const user = new User()
			const username = 'unituserconnect'
			await expect(user.connect(db, username)).resolves.toBeUndefined()
			//A second 'connect' hits the 'ON CONFLICT (username) DO NOTHING' branch in
			//'tryAccountCreation' (the username already exists), which resolves normally instead of
			//throwing - i.e. logging back in should be a no-op.
			await expect(user.connect(db, username)).resolves.toBeUndefined()
		})
	})

	describe('Utils', () => {
		const utils = new Utils()

		test('FindGameById resolves to null (without throwing) when given a null/undefined id', async () => {
			await expect(utils.FindGameById(db, null)).resolves.toBeNull()
			await expect(utils.FindGameById(db, undefined)).resolves.toBeNull()
		})

		test('FindGameById finds a game that was persisted to the database, and finds nothing for an unknown id', async () => {
			const hostUsername = 'unithostutils'
			const gameId = 'unit-game-utils'
			await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT DO NOTHING',
				[hostUsername]
			)
			await db.query(
				'INSERT INTO game (id, locked, finished, host) VALUES ($1, false, false, $2) ON CONFLICT DO NOTHING',
				[gameId, hostUsername]
			)

			const found = await utils.FindGameById(db, gameId)
			expect(found).toMatchObject({ id: gameId, host: hostUsername })

			const notFound = await utils.FindGameById(db, 'unit-game-missing')
			expect(notFound).toBeUndefined()
		})

		test("getUserScores returns a user's scores across games, most recent first", async () => {
			const username = 'unitscoreuser'
			const gameIdA = 'unit-game-scoreA'
			const gameIdB = 'unit-game-scoreB'
			await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT DO NOTHING',
				[username]
			)
			await db.query(
				'INSERT INTO game (id, locked, finished, host) VALUES ($1, false, true, $2) ON CONFLICT DO NOTHING',
				[gameIdA, username]
			)
			await db.query(
				'INSERT INTO game (id, locked, finished, host) VALUES ($1, false, true, $2) ON CONFLICT DO NOTHING',
				[gameIdB, username]
			)
			await db.query(
				'INSERT INTO player (username, game_id, score) VALUES ($1, $2, $3)',
				[username, gameIdA, 10]
			)
			await db.query(
				'INSERT INTO player (username, game_id, score) VALUES ($1, $2, $3)',
				[username, gameIdB, 20]
			)

			const scores = await utils.getUserScores(db, username)
			expect(scores).toHaveLength(2)
			expect(scores.map((s) => s.score).sort()).toEqual([10, 20])
			scores.forEach((s) => expect(s).toHaveProperty('gameId'))
		})

		test('getBestScores returns at most 10 entries, sorted by best score descending', async () => {
			const scores = await utils.getBestScores(db)
			expect(Array.isArray(scores)).toBe(true)
			expect(scores.length).toBeLessThanOrEqual(10)
			for (let i = 1; i < scores.length; i++) {
				expect(scores[i - 1].bestScore).toBeGreaterThanOrEqual(
					scores[i].bestScore
				)
			}
		})
	})

	describe('database (manageDatabase.js)', () => {
		test('query() runs parameterized SQL against the real database and returns rows', async () => {
			const result = await db.query('SELECT 1 + 1 AS sum')
			expect(result.rows[0].sum).toBe(2)
		})

		test('destroy_database + createDatabase recreate the schema from scratch without throwing', async () => {
			//Uses its own throwaway 'database' instance instead of the shared 'db' the rest of this file's
			//tests use: 'destroy_database'/'createDatabase' each open/close their own short-lived 'pg'
			//Client rather than going through a connection pool. Running this drops and recreates
			//'game'/'account'/'player' - safe here because no other test in this file relies on rows a
			//previous test left behind (each creates whatever account/game/player rows it needs itself).
			const { database } = require('./database/manageDatabase.js')
			const freshDb = new database(false) //'false': skip auto-connecting a pool - only the Client-based methods below are used.
			await freshDb.destroy_database()
			await freshDb.createDatabase()
			//The schema is back: a query through the original shared pool should succeed again.
			const result = await db.query('SELECT 1 + 1 AS sum')
			expect(result.rows[0].sum).toBe(2)
		})
	})
})

//These describes cover the client (React/Redux) side: the Redux slices' reducers (pure logic), the
//pure lookup-table utils the game board/pieces are built from, and the 'api/*.js' wrappers that the
//client actually calls into - the last of those against the very same live server the rest of this
//file talks to, so the client and server sides are verified together rather than each in isolation.
describe('Client redux slices', () => {
	describe('authSlice (userConnect dispatched against the real live server)', () => {
		const buildStore = () =>
			configureStore({ reducer: { auth: authSlice.reducer } })

		test('a successful connection marks the user authenticated', async () => {
			const store = buildStore()
			await store.dispatch(userConnect('clientAuthUser'))
			expect(store.getState().auth).toMatchObject({
				isAuthenticated: true,
				user: 'clientAuthUser',
				nameTooLong: false,
				nameInvalidChars: false,
			})
		})

		test('a name that is too long is rejected and flagged as such, without authenticating', async () => {
			const store = buildStore()
			await store.dispatch(userConnect('a'.repeat(25)))
			const state = store.getState().auth
			expect(state.isAuthenticated).toBe(false)
			expect(state.nameTooLong).toBe(true)
		})

		test('a name with invalid characters is rejected and flagged as such, without authenticating', async () => {
			const store = buildStore()
			await store.dispatch(userConnect('bad name!'))
			const state = store.getState().auth
			expect(state.isAuthenticated).toBe(false)
			expect(state.nameInvalidChars).toBe(true)
		})
	})

	describe('gameTimeSlice (pure reducer)', () => {
		const reducer = gameTimeSlice.reducer

		test('startGame marks the game active and resets timing fields', () => {
			const state = reducer(undefined, startGame())
			expect(state.isGameActive).toBe(true)
			expect(state.isGamePaused).toBe(false)
			expect(state.endTime).toBeNull()
			expect(typeof state.startTime).toBe('number')
		})

		test('pauseGame freezes currentTime, resumeGame accumulates the break into totalBreakTime', () => {
			let state = reducer(undefined, startGame())
			state = reducer(state, pauseGame())
			expect(state.isGamePaused).toBe(true)
			state = reducer(state, updateGameTime()) //A no-op while paused.
			expect(state.currentTime).toBe(0)
			state = reducer(state, resumeGame())
			expect(state.isGamePaused).toBe(false)
			expect(state.totalBreakTime).toBeGreaterThanOrEqual(0)
			expect(state.currentBreakTime).toBe(0)
		})

		test('endGame stops the game and freezes currentTime', () => {
			let state = reducer(undefined, startGame())
			state = reducer(state, endGame())
			expect(state.isGameActive).toBe(false)
			expect(typeof state.endTime).toBe('number')
		})
	})

	describe('gameplaySlice (pure reducer)', () => {
		const reducer = gameplaySlice.reducer

		test('setGrid / setScore / setPiecePosition update their own field only', () => {
			let state = reducer(undefined, setGrid([[1]]))
			state = reducer(state, setScore(99))
			state = reducer(state, setPiecePosition({ x: 2, y: 3 }))
			expect(state.grid).toEqual([[1]])
			expect(state.score).toBe(99)
			expect(state.piecePosition).toEqual({ x: 2, y: 3 })
		})

		test('resetGameplay resets the grid/piece but keeps the score; resetGameplayAndScore also resets the score', () => {
			let state = reducer(undefined, setScore(99))
			state = reducer(state, setPiecePosition({ x: 2, y: 3 }))

			const afterReset = reducer(state, resetGameplay())
			expect(afterReset.score).toBe(99) //Score untouched by 'resetGameplay'.
			expect(afterReset.piecePosition).toEqual({ x: 4, y: 0 })

			const afterResetAndScore = reducer(state, resetGameplayAndScore())
			expect(afterResetAndScore.score).toBe(0)
		})

		test('setBox / resetBox / setOrientation / setNextOrientation / setIsInContact / setIsGameOver update their own field', () => {
			let state = reducer(undefined, gameplaySlice.actions.setBox([[1]]))
			expect(state.box).toEqual([[1]])
			state = reducer(state, gameplaySlice.actions.setOrientation(90))
			expect(state.orientation).toBe(90)
			state = reducer(state, gameplaySlice.actions.setNextOrientation(180))
			expect(state.nextOrientation).toBe(180)
			state = reducer(state, gameplaySlice.actions.setIsInContact(true))
			expect(state.isInContact).toBe(true)
			state = reducer(state, gameplaySlice.actions.setIsGameOver(true))
			expect(state.isGameOver).toBe(true)
			state = reducer(state, gameplaySlice.actions.resetBox())
			expect(state.box).toEqual(
				Array.from({ length: 10 }, () => Array(10).fill(0))
			)
		})

		test('resetGameplayNotBox resets the grid/piece but leaves the box and score untouched', () => {
			let state = reducer(undefined, gameplaySlice.actions.setBox([[1]]))
			state = reducer(state, setScore(5))
			state = reducer(state, setPiecePosition({ x: 2, y: 3 }))
			state = reducer(state, gameplaySlice.actions.resetGameplayNotBox())
			expect(state.box).toEqual([[1]])
			expect(state.score).toBe(5)
			expect(state.piecePosition).toEqual({ x: 4, y: 0 })
		})

		test('EmitGridAndScore emits the current grid, and a score equal to the amount of pieces received (piece.index + 1) times 10', () => {
			const emit = jest.fn()
			const store = makeStore({
				socket: socketSlice.reducer,
				gameplay: gameplaySlice.reducer,
				piece: pieceSlice.reducer,
			})
			//Bypasses the real 'connect()'/socket.io round-trip: dispatching the thunk's own 'fulfilled'
			//action type directly is enough to seed 'state.socket.socket' with our fake socket (see
			//'socketSlice.js's extraReducers), since that's the only thing 'EmitGridAndScore' reads.
			store.dispatch({
				type: socketConnectThunk.fulfilled.type,
				payload: { emit },
			})
			store.dispatch(pieceSlice.actions.refresh(['I', 'O', 'T']))
			store.dispatch(incrementIndex()) //Player has now received 2 pieces (index 1).
			store.dispatch(EmitGridAndScore())
			expect(emit).toHaveBeenCalledWith(
				'updateScreenAndScore',
				expect.objectContaining({ score: 20 })
			)
			expect(store.getState().gameplay.score).toBe(20) //Also mirrored into 'gameplay.score'.
		})

		test('resetGameplayAndEmit emits the reset (empty) grid/score and resets gameplay state', () => {
			const emit = jest.fn()
			const store = makeStore({
				socket: socketSlice.reducer,
				gameplay: gameplaySlice.reducer,
			})
			store.dispatch({
				type: socketConnectThunk.fulfilled.type,
				payload: { emit },
			})
			store.dispatch(setScore(7))
			store.dispatch(resetGameplayAndEmit())
			expect(emit).toHaveBeenCalledWith(
				'updateScreenAndScore',
				expect.objectContaining({ score: 0 })
			)
			expect(store.getState().gameplay.score).toBe(0)
		})
	})

	describe('opponentsSlice (pure reducer)', () => {
		const reducer = opponentsSlice.reducer

		test('setOpponentGridAndScore creates an opponent entry, then only patches the fields given', () => {
			let state = reducer(
				undefined,
				setOpponentGridAndScore({ id: 'p1', grid: [[1]], score: 5 })
			)
			expect(state.byId.p1).toEqual({ grid: [[1]], score: 5, isGameOver: false })
			state = reducer(state, setOpponentGridAndScore({ id: 'p1', score: 10 }))
			expect(state.byId.p1).toEqual({ grid: [[1]], score: 10, isGameOver: false }) //Grid untouched since it was omitted.
		})

		test('removeOpponent / resetAllOpponents clear opponents', () => {
			let state = reducer(
				undefined,
				setOpponentGridAndScore({ id: 'p1', grid: [[1]], score: 5 })
			)
			state = reducer(
				state,
				setOpponentGridAndScore({ id: 'p2', grid: [[2]], score: 6 })
			)
			state = reducer(state, removeOpponent('p1'))
			expect(state.byId.p1).toBeUndefined()
			expect(state.byId.p2).toBeDefined()
			state = reducer(state, resetAllOpponents())
			expect(state.byId).toEqual({})
		})
	})

	describe('pieceSlice (pure reducer)', () => {
		const reducer = pieceSlice.reducer

		test('refresh sets the current/next piece and their tetromino shapes from the given basket', () => {
			const state = reducer(
				undefined,
				pieceSlice.actions.refresh(['I', 'O', 'T'])
			)
			expect(state.currentPiece).toBe('I')
			expect(state.nextPiece).toBe('O')
			expect(state.tetrominosCurrentPiece).toBe(TETROMINOS.I)
			expect(state.tetrominosNextPiece).toBe(TETROMINOS.O)
		})

		test('incrementIndex advances the current/next piece', () => {
			let state = reducer(
				undefined,
				pieceSlice.actions.refresh(['I', 'O', 'T'])
			)
			state = reducer(state, incrementIndex())
			expect(state.currentPiece).toBe('O')
			expect(state.nextPiece).toBe('T')
		})

		test('addPieces appends new baskets to the existing piece list', () => {
			let state = reducer(undefined, pieceSlice.actions.refresh(['I']))
			state = reducer(
				state,
				pieceSlice.actions.addPieces({ pieceBaskets: ['O', 'T'] })
			)
			expect(state.listPieces).toEqual(['I', 'O', 'T'])
		})

		test('removeCurrentPiece clears the current piece', () => {
			let state = reducer(undefined, pieceSlice.actions.refresh(['I']))
			state = reducer(state, removeCurrentPiece())
			expect(state.currentPiece).toBe('')
			expect(state.tetrominosCurrentPiece).toBeNull()
		})

		test("joining a room (joinRoomThunk.fulfilled) seeds the piece list from the game's pieceBasket", () => {
			const action = {
				type: joinRoomThunk.fulfilled.type,
				payload: { game: { pieceBasket: ['Z', 'S'] } },
			}
			const state = reducer(undefined, action)
			expect(state.listPieces).toEqual(['Z', 'S'])
			expect(state.currentPiece).toBe('Z')
			expect(state.nextPiece).toBe('S')
		})

		test('incrementIndexFun advances the index and asks the server for a new piece basket once nearing the end of the list', () => {
			const emit = jest.fn()
			const store = makeStore({
				piece: pieceSlice.reducer,
				socket: socketSlice.reducer,
			})
			store.dispatch({
				type: socketConnectThunk.fulfilled.type,
				payload: { emit },
			})
			store.dispatch(pieceSlice.actions.refresh(['I', 'O'])) //Only 2 pieces: index 0 is already 'length - 2'.
			store.dispatch(incrementIndexFun())
			expect(store.getState().piece.index).toBe(1)
			expect(emit).toHaveBeenCalledWith('askNewPiece', undefined) //The thunk calls 'askNewPiece' with no roomId.
		})
	})

	describe('roomSlice (pure reducer)', () => {
		const reducer = roomSlice.reducer

		test('setPlayers / setRoomId / setNewHost / gameStarted update their own field', () => {
			let state = reducer(undefined, setRoomId('room-x'))
			state = reducer(state, setPlayers(['a', 'b']))
			state = reducer(state, setNewHost('a'))
			state = reducer(state, gameStarted())
			expect(state).toMatchObject({
				id: 'room-x',
				players: ['a', 'b'],
				host: 'a',
				gameStarted: true,
			})
		})

		test('playerJoined appends a player, playerLeft removes one', () => {
			let state = reducer(undefined, setPlayers(['a']))
			state = reducer(state, playerJoined('b'))
			expect(state.players).toEqual(['a', 'b'])
			state = reducer(state, playerLeft('a'))
			expect(state.players).toEqual(['b'])
		})

		test('joinRoomThunk fulfilled/rejected populate room state or the error from the server', () => {
			const fulfilled = {
				type: joinRoomThunk.fulfilled.type,
				payload: { game: { id: 'room-y', players: ['a'], host: 'a' } },
			}
			const stateOk = reducer(undefined, fulfilled)
			expect(stateOk).toMatchObject({
				id: 'room-y',
				players: ['a'],
				host: 'a',
				error: null,
			})

			const rejected = {
				type: joinRoomThunk.rejected.type,
				payload: 'Could not join the room',
			}
			const stateErr = reducer(undefined, rejected)
			expect(stateErr.error).toBe('Could not join the room')
		})
	})

	describe('socketSlice (reducers, and socketConnectThunk against the real live server)', () => {
		const reducer = socketSlice.reducer

		test('socketConnected / socketConnectionFailed / socketDisconnected update status and error', () => {
			let state = reducer(undefined, socketConnected())
			expect(state).toMatchObject({ status: 'connected', error: null })
			state = reducer(state, socketConnectionFailed('boom'))
			expect(state).toMatchObject({ status: 'disconnected', error: 'boom' })
			state = reducer(state, socketDisconnected('io client disconnect'))
			expect(state).toMatchObject({
				status: 'disconnected',
				error: 'io client disconnect',
			})
		})

		test('socketConnectThunk opens a real socket.io connection and the store reflects "connected"', (done) => {
			const store = makeStore({ socket: socketSlice.reducer })
			authenticate('clientSockThunk')
				.then((token) => {
					store.dispatch(socketConnectThunk(token))
					const unsubscribe = store.subscribe(() => {
						if (store.getState().socket.status === 'connected') {
							unsubscribe()
							store.getState().socket.socket.disconnect()
							done()
						}
					})
				})
				.catch(done)
		})
	})
})

describe('Client utils (pure lookup tables the board/pieces are built from)', () => {
	test('CELL_COLORS maps every cell value (including empty=0 and ghost=8) to a color string', () => {
		expect(CELL_COLORS[0]).toBe('black')
		expect(CELL_COLORS[8]).toBe('gray')
		expect(
			Object.values(CELL_COLORS).every((color) => typeof color === 'string')
		).toBe(true)
	})

	test('PIECE_STARTING_ORIENTATIONS defines a starting rotation for all 7 tetromino types', () => {
		expect(Object.keys(PIECE_STARTING_ORIENTATIONS).sort()).toEqual([
			'I',
			'J',
			'L',
			'O',
			'S',
			'T',
			'Z',
		])
		expect(PIECE_STARTING_ORIENTATIONS.I).toBe(90) //The only piece that doesn't start flat.
	})

	test('PIECES_COLOR_CODES assigns a unique numeric code to each of the 7 pieces', () => {
		const codes = Object.values(PIECES_COLOR_CODES)
		expect(new Set(codes).size).toBe(7)
	})

	test('TETROMINOS defines all 4 rotations (0/90/180/270) for every piece, each made of exactly 4 cells', () => {
		for (const piece of Object.keys(PIECES_COLOR_CODES)) {
			expect(TETROMINOS).toHaveProperty(piece)
			for (const rotation of [0, 90, 180, 270]) {
				expect(TETROMINOS[piece][rotation]).toHaveLength(4)
			}
		}
	})

	test('WALL_KICK_OFFSETS defines 4 kick offsets per rotation for every piece except O (which never needs one)', () => {
		expect(WALL_KICK_OFFSETS.O).toBeUndefined()
		for (const piece of Object.keys(WALL_KICK_OFFSETS)) {
			for (const rotation of [0, 90, 180, 270]) {
				expect(WALL_KICK_OFFSETS[piece][rotation]).toHaveLength(4)
			}
		}
	})
})

describe('Client API layer (src/client/api) against the real live server', () => {
	test('http.api.connect() authenticates against the real server and returns a jwt', async () => {
		const res = await httpApi.connect('httpApiUser')
		expect(res.status).toBe(200)
		expect(res.data).toHaveProperty('jwt')
		expect(res.data).toHaveProperty('username', 'httpApiUser')
	})

	test('http.api.getJoinableGames() / getBestScores() / getUserScores() succeed against the real server', async () => {
		const joinable = await httpApi.getJoinableGames()
		expect(joinable.status).toBe(200)
		expect(Array.isArray(joinable.games)).toBe(true)

		const best = await httpApi.getBestScores()
		expect(best.status).toBe(200)
		expect(Array.isArray(best.scores)).toBe(true)

		const userScores = await httpApi.getUserScores('httpApiUser')
		expect(userScores.status).toBe(200)
		expect(Array.isArray(userScores.scores)).toBe(true)
	})

	test('socket.api connect()/joinRoom()/leaveRoom() drive a real socket connection through the client wrappers', (done) => {
		const roomId = 'room-capi'
		const username = usernameFor(roomId, 'CA')

		authenticate(username)
			.then((token) => {
				const socket = socketApiClient.connect(token)
				socket.on('connect_error', done)
				socket.on('connect', () => {
					socketApiClient
						.joinRoom(username, socket, roomId)
						.then((data) => {
							expect(data.game).toHaveProperty('id', roomId)
							expect(data.game.players.map((p) => p.username)).toContain(
								username
							)
							socketApiClient.leaveRoom(socket)
							socket.disconnect()
							done()
						})
						.catch(done)
				})
			})
			.catch(done)
	})

	test('socket.api leaveRoom() resolves only once the server acks (regression: callers must be able to wait for the leave, and its score-persisting DB write, before trusting freshly-fetched scores)', (done) => {
		const roomId = 'room-capi-ack'
		const username = usernameFor(roomId, 'CA')

		authenticate(username)
			.then((token) => {
				const socket = socketApiClient.connect(token)
				socket.on('connect_error', done)
				socket.on('connect', () => {
					socketApiClient
						.joinRoom(username, socket, roomId)
						.then(() => socketApiClient.leaveRoom(socket)) //Would hang/time out if the server never called the ack.
						.then(() => {
							socket.disconnect()
							done()
						})
						.catch(done)
				})
			})
			.catch(done)
	})

	test('disconnect() closes a real socket, and is a no-op when given a falsy socket', (done) => {
		expect(() => socketApiClient.disconnect(null)).not.toThrow() //Falsy branch: nothing to disconnect.

		authenticate(usernameFor('room-sadc', 'X'))
			.then((token) => {
				const socket = socketApiClient.connect(token)
				socket.on('connect_error', done)
				socket.on('connect', () => {
					socket.on('disconnect', () => done())
					socketApiClient.disconnect(socket)
				})
			})
			.catch(done)
	})

	//The rest of 'socket.api.js' is made of thin 'socket.emit'/'socket.on' wrappers around the same
	//events already exercised (via raw socket calls) in the 'Socket.IO flows' describe above. These two
	//tests drive the same real server through the client wrapper functions themselves instead, so that
	//code path (the one the actual React app calls into) is verified too.
	test('join-time client listeners: listenPlayerJoined, listenOtherScreenAndScore, listenLinesCleared, listenStartGame and listenNextPiece all fire for real server broadcasts', (done) => {
		const roomId = 'room-sockapi-1'
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		let socketA, socketB

		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}
		const onErr = (err) => {
			cleanup()
			done(err)
		}

		//A connects and joins (creating the room, becoming host) *before* B even connects, so which one
		//ends up host is deterministic - both joining concurrently would race, since the server decides
		//who created the room based on whichever socket's 'joinRoom' message it happens to process first.
		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				socketA = socketApiClient.connect(tokenA)
				socketA.on('connect_error', onErr)

				const onPlayerJoinedA = jest.fn() //Registered before A joins: the server broadcasts 'playerJoined' to the whole room, including the joiner.
				socketApiClient.listenPlayerJoined(socketA, onPlayerJoinedA)

				socketA.on('connect', () => {
					socketApiClient
						.joinRoom(userA, socketA, roomId)
						.then(() => {
							socketB = socketApiClient.connect(tokenB)
							socketB.on('connect_error', onErr)
							socketB.on('connect', () => {
								socketApiClient
									.joinRoom(userB, socketB, roomId)
									.then(() => {
										const onScreenUpdate = jest.fn()
										const onLinesCleared = jest.fn()
										const onGameStarted = jest.fn()
										const onNextPiece = jest.fn()
										socketApiClient.listenOtherScreenAndScore(
											socketB,
											onScreenUpdate
										)
										socketApiClient.listenLinesCleared(socketB, onLinesCleared)
										socketApiClient.listenStartGame(socketB, onGameStarted)
										socketApiClient.listenNextPiece(socketB, onNextPiece)

										socketApiClient.startGame(socketA, roomId) //A is host (joined first).
										socketApiClient.updateScreenAndScore(socketA, [[0]], 5)
										socketApiClient.sendLinesCleared(socketA, 2) //Server subtracts 1, so this still broadcasts (2 - 1 > 0).
										socketApiClient.askNewPiece(socketA)
										socketApiClient.requestPieceBasket(socketA) //No matching server handler exists - only exercised for its own statement coverage.

										setTimeout(() => {
											try {
												expect(onPlayerJoinedA).toHaveBeenCalled()
												expect(onGameStarted).toHaveBeenCalled()
												expect(onScreenUpdate).toHaveBeenCalled()
												expect(onLinesCleared).toHaveBeenCalled()
												expect(onNextPiece).toHaveBeenCalled()
												cleanup()
												done()
											} catch (err) {
												onErr(err)
											}
										}, 500)
									})
									.catch(onErr)
							})
						})
						.catch(onErr)
				})
			})
			.catch(onErr)
	})

	test('end-of-game client listeners: listenPlayerLeft, listenNewHost, updateScore and listenNextGame all fire for real server broadcasts', (done) => {
		const roomId = 'room-sockapi-2'
		const userA = usernameFor(roomId, 'A')
		const userB = usernameFor(roomId, 'B')
		let socketA, socketB

		const cleanup = () => {
			if (socketA && socketA.connected) socketA.disconnect()
			if (socketB && socketB.connected) socketB.disconnect()
		}
		const onErr = (err) => {
			cleanup()
			done(err)
		}

		//Same reasoning as the previous test: A joins (and thus becomes host) before B even connects, so
		//"A is host" below is guaranteed rather than a race between the two sockets' 'joinRoom' messages.
		Promise.all([authenticate(userA), authenticate(userB)])
			.then(([tokenA, tokenB]) => {
				socketA = socketApiClient.connect(tokenA)
				socketA.on('connect_error', onErr)

				socketA.on('connect', () => {
					socketApiClient
						.joinRoom(userA, socketA, roomId)
						.then(() => {
							socketB = socketApiClient.connect(tokenB)
							socketB.on('connect_error', onErr)
							socketB.on('connect', () => {
								socketApiClient
									.joinRoom(userB, socketB, roomId)
									.then(() => {
										const onPlayerLeft = jest.fn()
										const onNewHost = jest.fn()
										const onScoreUpdate = jest.fn()
										const onNextGame = jest.fn()
										socketApiClient.listenPlayerLeft(socketB, onPlayerLeft)
										socketApiClient.listenNewHost(socketB, onNewHost)
										socketApiClient.updateScore(socketB, onScoreUpdate)
										socketApiClient.listenNextGame(socketB, onNextGame)

										//A both loses (triggers 'updateScore', since that makes every player have
										//lost) and then leaves as host (triggers 'playerLeft' + 'newHost', since B
										//is promoted). A also sends B the 'nextGame' payload, covering 'listenNextGame'.
										socketApiClient.looseGame(socketA)
										socketB.emit('looseGame') //B also has to lose for the server to consider "all players lost".
										socketApiClient.sendNextGame(socketA, roomId, {
											winner: userB,
										})
										socketApiClient.leaveRoom(socketA)

										setTimeout(() => {
											try {
												expect(onScoreUpdate).toHaveBeenCalled()
												expect(onNextGame).toHaveBeenCalledWith({
													winner: userB,
												})
												expect(onPlayerLeft).toHaveBeenCalled()
												expect(onNewHost).toHaveBeenCalled()
												cleanup()
												done()
											} catch (err) {
												onErr(err)
											}
										}, 500)
									})
									.catch(onErr)
							})
						})
						.catch(onErr)
				})
			})
			.catch(onErr)
	})
})
