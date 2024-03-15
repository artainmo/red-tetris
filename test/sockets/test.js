const axios = require('axios');
axios.defaults.baseURL = "http://localhost:3000/rest";
const { execSync } = require('child_process');
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
	console.log("Alfred asks for a new piece that should be send to all room members.")
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
	console.log("---------- Get game structures of other players ----------")

}

async function start() {
	await test()
	//await compare_results();
}

start()
