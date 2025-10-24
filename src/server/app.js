const express = require('express');
const socketio = require('socket.io');
const { Player } = require(__dirname + '/classes/Player.js');
const { Game } = require(__dirname + '/classes/Game.js');
const { PieceBasket } = require(__dirname + '/classes/PieceBasket.js');
const { database } = require(__dirname + '/database/manageDatabase.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const activeUsers = new Map();
const SECRET_KEY = crypto.randomBytes(64).toString('hex');

// /* only for dev purpose (remove after !)
const cors = require('cors');
app.use(cors());
const { Utils } = require('./classes/Utils');


const corsOptions = {
  	origin: true,
  	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  	allowedHeaders: ['Access-Control-Allow-Origin'],
}

// app.get('/', cors(corsOptions), function (req, res, next) {
//   //res.json({msg: 'This is CORS-enabled for only example.com.'})
// })
// * */

const server = app.listen(3000, () => {
  	console.log(`App listening at http://localhost:3000`);
});

/*
** When reading index.html the browser will have to make a HTTP GET request for the script it contains named 'bundle.js'.
** We use the following commands to serve static files found inside the repository containing the bundled app.
** This will allow the browser to make a HTTP GET request like so 'http://localhost:3000/bundle.js' to get the bundle.js file.
*/
const path_to_bundled_files = __dirname + "/../../dist/";
app.use(express.static(path_to_bundled_files));

//Send our bundled single-page-application frontend in one HTTP request when on homepage
app.get('/', (req, res) => {
  	res.sendFile('index.html', { root: path_to_bundled_files});
});

//Create a router to separate all the HTTP requests aimed at communicating with the database
const router = express.Router()
app.use('/rest', router);

router.use(express.json()) //Parse incoming json bodies

router.get('/connect/:name', async (req, res, next) => {
  	const name =  decodeURIComponent(req.params.name);
  	const player = new Player();

  	try {
    	await player.connect(name);
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

router.get('/games/', async (req,res) => {
	const utils = new Utils();
	const games = await utils.GetAllGames();
	res.status(200).json(games);
});

router.get('/joinablegames/', async (req,res) => {
	const utils = new Utils();
	const games = await utils.GetJoinableGames();
	res.status(200).json(games);
});

router.get('/games/:name', async (req,res) => {
  	const name = req.params.name;
  	const player = new Player();

  	await player.connect(name);
  	const games = await player.getAllPastGames();
  	res.status(200).json(games);
});

router.get('/game/search/:name', async (req,res) => {
  	const username = req.params.name;
	const utils = new Utils();
  	const game = await utils.createMultiGame(username);
  	res.status(200).json(game);
});

router.get('/game/multi/:name', async (req,res) => {
	const username = req.params.name;
  	const utils = new Utils();
	const game = await utils.createMultiGame(username);
	res.status(200).json(game);
});

router.post('/game/join/:id', async (req,res) => {
	console.log("game join")
	console.log(req.body.username)
	const gameId = req.params.id;
	const username = req.body.username;
  	const utils = new Utils();
	const game = await utils.joinMultiGame(gameId, username);
	res.status(200).json(game);
});

router.get('/game/solo/:name', async (req,res) => {
  	const name = req.params.name;
  	const player = new Player();

  	await player.connect(name);
  	const game = await player.createSoloGame();
    res.status(200).json(game);
});

router.post('/game/wait/join', async () => {
	const utils = new Utils();
  	const game = await utils.GetJoinableGames();
	if (game != null)
  		res.status(200).json(game);
	else
		res.status(400).send("No joinable rooms");
});

router.patch('/game/start', async (req,res,next) => {
  	const body = req.body;
    const game = new Game(body._id, body._player1, body._player2, body._player3, body._player4, body._player5, body._player6,
          body._player1_score, body._player2_score, body._player3_score, body._player4_score, body._player5_score, body._player6_score);

  	const ret = await game.start_play();
  	if (ret === false) {
    	res.status(400).send("Unable to start this game.");
  	} else {
    	res.status(200).send(`Game started between ${body._player1} and ${body._player2} and ${body._player3} and ${body._player4} and ${body._player5} and ${body._player6}.`);
  	}
});

router.post('/game/wait/start', async (req,res,next) => {
  	const body = req.body;
    const game = new Game(body._id, body._player1, body._player2, body._player3, body._player4, body._player5, body._player6,
          body._player1_score, body._player2_score, body._player3_score, body._player4_score, body._player5_score, body._player6_score);

  	const ret = await game.waitGameStart();
  	if (ret === false) {
    	res.status(400).send("This game has not been started.");
  	} else {
    	res.status(200).send(`${body._player1} started the game.`);
  	}
});

router.post('/game/:gameId/score/', async (req,res) => {
	console.log("router part")
	const utils = new Utils();
	const gameId = req.params.gameId;
	console.log(gameId)
	const { playerId, score } = req.body;
	try {
		await utils.UpdateGame(gameId, playerId, score)
		res.status(200).send("Game updated successfully");
	}
	catch (error) {
		res.status(400).send("This game could not be updated with error " + error);
	}
});

router.patch('/game/quit/:name', async (req,res,next) => {
  	const name = req.params.name;
  	const body = req.body;
    const game = new Game(body._id, body._player1, body._player2, body._player3, body._player4, body._player5, body._player6,
          body._player1_score, body._player2_score, body._player3_score, body._player4_score, body._player5_score, body._player6_score);

  	const newGame = await game.quit(name);
  	if (newGame === false) {
    	res.status(400).json(game); //As nobody quitted send initial game back
  	} else {
    	res.status(200).json(newGame);
  	}
});

router.post('/game/next', async (req,res,next) => {
  	const body = req.body;
    const game = new Game(body._id, body._player1, body._player2, body._player3, body._player4, body._player5, body._player6,
          body._player1_score, body._player2_score, body._player3_score, body._player4_score, body._player5_score, body._player6_score);

  	// game.display() //debug
  	const newGame = await game.next_game();
  	if (newGame === false) {
    	res.status(400).send("This game is not finished. Can't go to next game.");
  	} else {
    	res.status(200).json(newGame);
  	}
});

router.patch('/game/wait/quit', async (req,res,next) => {
  	const body = req.body;
    const game = new Game(body._id, body._player1, body._player2, body._player3, body._player4, body._player5, body._player6,
          body._player1_score, body._player2_score, body._player3_score, body._player4_score, body._player5_score, body._player6_score);

  	const newGame = await game.waitForSomeoneToQuit();
  	if (newGame === false) {
    	res.status(400).json(game);
  	} else {
    	res.status(200).json(newGame);
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

var pieceBaskets = {};
var rooms = {}
var users = {}

io.use((socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		if (!token) return next(new Error("Token missing"));
		const decoded = jwt.verify(token, SECRET_KEY);
		if (activeUsers.get(decoded.username)) {
			const err = new Error("User already connected elsewhere");
			err.data = { reason: "User already connected elsewhere" }; // <– sera transmis au client
			return next(err);
		}

		socket.userId = decoded.username;
		next();
	} catch (err) {
		next(new Error("Invalid token"));
	}
});

io.on('connection', async (socket) => {
  	console.log('A user connected to websocket');
	activeUsers.set(socket.userId, socket);

    socket.on('disconnect', () => {
    	console.log('A user disconnected from websocket and thus left its room');
		activeUsers.delete(socket.userId);
    });

    //Each room represents a game, the roomId is game's id
    //All players of same game must connect to same room
    socket.on('joinRoom', (data) => {
        console.log('A user ' + data.username + ' joined the room named ' + data.roomId);
        socket.join(data.roomId);
		if (!rooms[data.roomId]) {
			rooms[data.roomId] = [];
		}
		const players = rooms[data.roomId];
		players.push(socket.id)
		console.log(players)
		console.log("players len")
		console.log(players.length)
		if (players.length > 1)
			io.to(data.roomId).emit('newPlayerJoined', { player: data.username, room: data.roomId});
		
    });

	socket.on('startGame', (roomId) => {
		console.log('starting game to room id' + roomId);
		io.to(roomId).emit('startGame')

	});

    socket.on('askNewPiece', (roomId) => {
        console.log("Sending new piece to " + roomId);
        if (!(roomId in pieceBaskets)) {
          pieceBaskets[roomId] = new PieceBasket()
        }
        const piece = pieceBaskets[roomId].getNextPiece()
        io.to(roomId).emit('newPiece', piece); //Broadcast to all room members the same new piece
    });


    socket.on('sendPersonalGameStructure', (data) => {
        socket.broadcast.to(data.roomId).emit('otherPlayerGameStructure',
            data.gameStructure); //Broadcast to all room members the game structures of all players
    });

    socket.on('sendNextGame', (data) => {
    		console.log("Sending next game");
        socket.broadcast.to(data.roomId).emit('nextGame', data.nextGame); //Broadcast to all room members the next game, whereby last winner will become host
    });
  
	// socket.on('ready', () => {
	//   console.log(socket.id, "is ready!");
	//   const room = rooms[socket.roomId];
	//   // when we have two players... START THE GAME!
	//   if (room.sockets.length > 1) {
	// 	// tell each player to start the game.
	// 	for (const client of room.sockets) {
	// 	  client.emit('initGame');
	// 	}
	//   }
	// });
  
	socket.on('startGame', (data, callback) => {
	  const room = rooms[socket.roomId];
	  if (!room) {
		return;
	  }
	});
  
});