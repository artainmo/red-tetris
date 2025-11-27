const express = require('express');
const socketio = require('socket.io');
const { User } = require(__dirname + '/classes/User.js');
const { Utils } = require(__dirname + '/classes/Utils.js');
const { Game } = require('./classes/Game.js');
const { database } = require(__dirname + '/database/manageDatabase.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const activeUsers = new Map();
const SECRET_KEY = crypto.randomBytes(64).toString('hex');
const db = new database();
	
	
	
const corsOptions = {
	origin: true,
	optionsSuccessStatus: 200,
	allowedHeaders: ['Access-Control-Allow-Origin'],
}

const server = app.listen(3000, () => {
	console.log(`App listening at http://localhost:3000`);
});

const activeGames = new Map()
	
const path_to_bundled_files = __dirname + "/../../dist/";

const router = express.Router()
app.use('/rest', router);

router.use(express.json());

var pieceBaskets = {};
var socketToGame = new Map();

router.get('/connect/:name', async (req, res, next) => {
	console.log("connect route called: " + req.params.name);
	const name =  decodeURIComponent(req.params.name);
	const user = new User();
	
	try {
		await user.connect(db, name);
		console.log("User connected: " + name);
		res.status(200).json({
			message: `Connection success of ${name}`,
			jwt: jwt.sign({ username: name }, SECRET_KEY, { expiresIn: '24h' }),
            username: name
		});
	} catch (e) {
    	console.log(e.message);
		res.status(400).json({ message: e.message });
	}
});

router.get('/joinablegames/', async (req,res) => {
	const joinableGames = [];
	const listGames = Array.from(activeGames.values()).filter(game => !game.locked);
	for (let i = 0; i < listGames.length; i++) {
		joinableGames.push(listGames[i].toJSON());
	}
	res.status(200).json(joinableGames);
});

router.get('/scores/:name', async (req,res) => {
	const name = req.params.name;
	const utils = new Utils();
	try {
		const scores = await utils.getUserScores(db, name);
		res.status(200).json(scores);
	} catch (error) {
		res.status(400).send("Could not retrieve user scores: " + error);
	}
});

router.get('/bestscores/', async (req,res) => {
	const utils = new Utils();
	try {
		const scores = await utils.getBestScores(db);
		res.status(200).json(scores);
	} catch (error) {
		res.status(400).send("Could not retrieve best scores: " + error);
	}
});

/***********************************************/
/***********		SOCKETS		 ***************/
/***********************************************/

const io = socketio(server, {
	cors: {
		origin: true,
		methods: "*",
	}
});

	
	io.use((socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		if (!token) return next(new Error("Token missing"));
		const decoded = jwt.verify(token, SECRET_KEY);
		if (activeUsers.get(decoded.username)) {
			const err = new Error("User already connected elsewhere");
			err.data = { reason: "User already connected elsewhere" }; 
			return next(err);
		}
		
		socket.userId = decoded.username;
		next();
	} catch (err) {
		next(new Error("Invalid token"));
	}
});

app.use(express.static(path_to_bundled_files));

app.get('*', (req, res) => {
	res.sendFile('index.html', { root: path_to_bundled_files});
});

const leaveRoom = async (socket) => {
	const gameId = socketToGame.get(socket.id);
	if (!gameId) { return; }
	socketToGame.delete(socket.id);
	const game = activeGames.get(gameId);
	if (!game) { return; }
	host = game.host;
	game.removePlayer(socket.userId);
	if (host !== game.host) {
		socket.broadcast.to(game.id).emit('newHost', { newHost: game.host, room: game.id});
	}
	console.log('User ' + socket.userId + ' left room ' + gameId);
	io.to(game.id).emit('playerLeft', { player: socket.userId, room: game.id});
	socket.leave(game.id);
	console.log(`players remaining in game ${game.id}: ${game.players.length}`);
	if (game.players.length === 0) {
		console.log(`Game ${game.id} deleted as it became empty`);
		await game.setDB(db);
		activeGames.delete(game.id);
	}
}

io.on('connection', async (socket) => {
	console.log(`User ${socket.userId} connected to websocket`);
	activeUsers.set(socket.userId, socket);

    socket.on('disconnect', async () => {
		console.log(`User ${socket.userId} disconnected from websocket and thus left its room`);
		await leaveRoom(socket);
		activeUsers.delete(socket.userId);
    });

    socket.on('joinRoom', async(data, callback) => {
		console.log(`${data.username} is attempting to join room ${data.roomId}`);
		try {
			await leaveRoom(socket);
			if (activeGames.has(data.roomId)) {
				const existingGame = activeGames.get(data.roomId);
				if (existingGame.locked) {
					throw "Game is already started";
				}
				if (existingGame.addPlayer(data.username, socket) !== false) {
					socketToGame.set(socket.id, data.roomId);
					socket.join(data.roomId);
					console.log(`${data.username} joined existing active game ${data.roomId}`);
					// io.to(data.roomId).emit('playerJoined', { player: data.username, room: data.roomId});
					for (const player of existingGame.players) {
						if (player.username === data.username) continue;
						socket.emit('screenAndScoreUpdate',
						{ player: player.username, structure: Array(20).fill().map(() => Array(10).fill(0)), score: 0 });
					}

					socket.broadcast.to(data.roomId).emit('screenAndScoreUpdate',
					{ player: data.username, structure: Array(20).fill().map(() => Array(10).fill(0)), score: 0 });
					callback({ success: true, data: { game: existingGame.toJSON() } });
				} else {
					throw "Game is full";
				}
			}
			else {
				const newGame = new Game(data.roomId, false, false, data.username);
				activeGames.set(data.roomId, newGame);
				const utils = new Utils();
				const gameData = await utils.FindGameById(db, data.roomId);
				if (gameData) {
					activeGames.delete(data.roomId);
					throw "Game with this ID is already finished";
				}
				newGame.addPlayer(data.username, socket);
				socketToGame.set(socket.id, data.roomId);
				socket.join(data.roomId);
				io.to(data.roomId).emit('playerJoined', { player: data.username, room: data.roomId});
				callback({ success: true, data: { game: newGame.toJSON() } });
				console.log(`${data.username} created and joined new active game ${data.roomId}`);
			}
		} catch (error) {
			console.log("Could not join the room: " + error);
			callback({ success: false, message: "Could not join the room: " + error });
		}
    });

	socket.on('leaveRoom', async () => {
		await leaveRoom(socket);
	});

	socket.on('startGame', async () => {
		const roomId = socketToGame.get(socket.id);
		if (!roomId) return;
		const game = activeGames.get(roomId);
		if (!game) return;
		if (game.host !== socket.userId) {
			console.log("Only the host can start the game, id of host: " + game.host + ", id of requester: " + socket.userId);
			return;
		}
		game.locked = true;
		console.log(`Starting game in room ${roomId}`);
		io.to(roomId).emit('startGame');
	});

	socket.on('gameOver', async () => {
		const roomId = socketToGame.get(socket.id);
		if (!roomId) return;
		const game = activeGames.get(roomId);
		if (!game) return;
		console.log(`Game over for player ${socket.userId} in room ${roomId}`);
		socket.broadcast.to(roomId).emit('playerGameOver', { player: socket.userId });
	});

	socket.on('looseGame', async () => {
		const roomId = socketToGame.get(socket.id);
		if (!roomId) return;
		const game = activeGames.get(roomId);
		if (!game) return;
		console.log(`Player ${socket.userId} lost the game in room ${roomId}`);
		game.playerLoosed(socket.userId);
		if (game.allPlayersLoosed()) {
			console.log(`All players lost in game ${roomId}. Ending game.`);
			io.to(roomId).emit('updateScore', {username: socket.userId, score: game.players.find(p => p.username === socket.userId).score + 250 * game.players.length });
			// activeGames.delete(roomId);
		}
		socket.broadcast.to(roomId).emit('playerLoosed', { player: socket.userId });
		
	});

    socket.on('updateScreenAndScore', (data) => {
		const lobby = socketToGame.get(socket.id);
		const game = activeGames.get(lobby);
		if (!game || game.players.length === 0) return;
		const player = game.players.find(p => p.username === socket.userId);
		if (player) {
			player.score = data.score;
		}
		if (!lobby) return;
        socket.broadcast.to(lobby).emit('screenAndScoreUpdate',
            { player: socket.userId, structure: data.structure, score: data.score });
    });
	
	socket.on('linesCleared', (data) => {
		const linesCleared = data.linesCleared - 1;
		const lobby = socketToGame.get(socket.id);
		if (!lobby) return;
		if (linesCleared > 0) {
		socket.broadcast.to(lobby).emit('linesCleared',
			{ player: socket.userId, linesCleared: linesCleared });
		}
	});

	socket.on('askNewPiece', () => {
		const roomId = socketToGame.get(socket.id);
		if (!roomId) return;
		const game = activeGames.get(roomId);
		if (!game) return;
		console.log(`Sending new piece baskets to room ${roomId}`);
		const piece = game.piece;
		const pieceBaskets = piece.generatePieceBasket();
		io.to(roomId).emit('nextPiece', {pieceBaskets});
	});

	socket.on('restartGame', () => {
		const roomId = socketToGame.get(socket.id);
		if (!roomId) return;
		const game = activeGames.get(roomId);
		if (game.host !== socket.userId) {
			console.log("Only the host can restart the game");
			return;
		}
		console.log(`Restarting game in room ${roomId}`);
		io.to(roomId).emit('restartGame');
	});

    socket.on('sendNextGame', (data) => {
    		console.log("Sending next game");
        socket.broadcast.to(data.roomId).emit('nextGame', data.nextGame); //Broadcast to all room members the next game, whereby last winner will become host
    });
  
});