const axios = require('axios');
axios.defaults.baseURL = "http://localhost:3000/rest";
const { execSync, fork } = require('child_process');
const io = require("socket.io-client");
const { sleep } = require(__dirname + '/../utils/utils.js');

async function test() {
	console.log("---------- Database refresh ----------")
	execSync(`cd ${__dirname}/../.. && make refresh_database`, { encoding: 'utf-8' });

	console.log("---------- Account creation ----------")
  	var response = await axios.get("/connect/Alfred");
  	console.log(response.status + ":");
	//console.log(response.data);
 	var response = await axios.get("/connect/Conrad");
 	console.log(response.status + ":");
 	//console.log(response.data);
 	var response = await axios.get("/connect/Philip");
 	console.log(response.status + ":");
 	//console.log(response.data);
	
	console.log("---------- Matchmaking ----------")
	console.log('Alfred creates game:')
	var response = await axios.get("/game/search/Alfred");
	console.log(response.status + ":");
 	//console.log(response.data);
	console.log('Conrad searches a game:')
	var response = await axios.get("/game/search/Conrad");
	console.log(response.status + ":");
	//console.log(response.data); 
	console.log('Philip searches a game:')
	var response = await axios.get("/game/search/Philip");
	console.log(response.status + ":");
	//console.log(response.data);
	var game = response.data;
	console.log('Start the game:')
	var response = await axios.patch("/game/start", game);
	console.log(response.status + ":");
	//console.log(response.data);
	console.log(game)

	console.log("---------- Socket connection ----------")
	var socketAlfred = await io("http://localhost:3000");
	console.log('Alfred connected to ' + socketAlfred.io.uri)
	socketAlfred.disconnect();
	console.log('Alfred disconnected from ' + socketAlfred.io.uri)
	socketAlfred = await io("http://localhost:3000");
	console.log('Alfred connected to ' + socketAlfred.io.uri)
	socketConrad = await io("http://localhost:3000");
	console.log('Conrad connected to ' + socketConrad.io.uri)
	socketPhilip = await io("http://localhost:3000");
	console.log('Philip connected to ' + socketPhilip.io.uri)
	console.log("---------- Join room ----------")
	var roomId = game._id
	socketAlfred.emit("joinRoom", roomId);
	console.log("Alfred joined room " + roomId)
	socketConrad.emit("joinRoom", roomId);
	console.log("Conrad joined room " + roomId)
	socketPhilip.emit("joinRoom", roomId);
	console.log("Philip joined room " + roomId)

	if (process.argv.length > 2 && process.argv[2] === "piece") {
		console.log("---------- Get new piece ----------")
		console.log("Alfred listens to new piece")
		socketAlfred.on('newPiece', (data) => {
			console.log("Alfred: new incoming piece:");
			console.log(data);
  		});
		console.log("Conrad listens to new piece")
		socketConrad.on('newPiece', (data) => {
			console.log("Conrad: new incoming piece:");
			console.log(data);
  		});
		console.log("Philip listens to new piece")
		socketPhilip.on('newPiece', (data) => {
			console.log("Philip: new incoming piece:");
			console.log(data);
  		});
		console.log("Alfred asks for a new piece that should be send to all room members")
		socketAlfred.emit('askNewPiece', roomId);
		//console.log("2: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("3: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("4: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("5: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("6: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("7: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
		//console.log("8: Alfred asks for a new piece that should be send to all room members.")
		//socketAlfred.emit('askNewPiece', roomId);
	} else if (process.argv.length > 2 && process.argv[2] === "struct") {
		console.log("---------- Get game structures of other players ----------")
		AlfredGameStructure = {
			player: 'Alfred',
			structure: [['L', 'BG', 'BG'],
						['BG', 'BG', 'BG'],
						['BG', 'T', 'BG']]
		};
		ConradGameStructure = {
			player: 'Conrad',
			structure: [['O', 'BG', 'BG'],
						['BG', 'BG', 'BG'],
						['BG', 'T', 'BG']]
		};
		PhilipGameStructure = {
			player: 'Philip',
			structure: [['I', 'BG', 'BG'],
						['BG', 'BG', 'BG'],
						['BG', 'T', 'BG']]
		};
		console.log("Alfred listens for other players' game structure")
		socketAlfred.on('otherPlayerGameStructure', (data) => {
			console.log("Alfred: new incoming game structure:");
    		console.log(data)
  		});
		console.log("Alfred sends his game structure to other members")
		socketAlfred.emit('sendPersonalGameStructure',
      		{roomId: roomId, gameStructure: AlfredGameStructure});
		console.log("Conrad sends his game structure to other members")
		socketConrad.emit('sendPersonalGameStructure',
      		{roomId: roomId, gameStructure: ConradGameStructure});
		console.log("Philip sends his game structure to other members")
		socketPhilip.emit('sendPersonalGameStructure',
      		{roomId: roomId, gameStructure: PhilipGameStructure});
	} else if (process.argv.length > 2 && process.argv[2] === "next") {
		console.log("---------- Get next game ----------")
		nextGame = {
          _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
          _player1: 'Conrad',
          _player2: 'Alfred',
          _player3: 'Philip',
          _player4: null,
          _player5: null,
          _player6: null,
          _player1_score: null,
          _player2_score: null,
          _player3_score: null,
          _player4_score: null,
          _player5_score: null,
          _player6_score: null
        }
		console.log("Alfred listens for next game")
		socketAlfred.on('nextGame', (data) => {
			console.log("Alfred: Next game:");
    		console.log(data)
  		});
		console.log("Conrad listens for next game")
		socketConrad.on('nextGame', (data) => {
			console.log("Conrad: Next game:");
    		console.log(data)
  		});
		console.log("Philip listens for next game")
		socketPhilip.on('nextGame', (data) => {
			console.log("Philip: Next game:");
    		console.log(data)
  		});
		console.log("The host Alfred sends the next game to all other room members")
		socketAlfred.emit('sendNextGame', {roomId: roomId, nextGame: nextGame});
	} else {
		console.log('\nUse as command line argument: "piece", "struct" or "next". For further testing.')
	}
}

async function start() {
	await test()
	//await compare_results();
}

start()
