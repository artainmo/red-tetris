const { sleep } = require(__dirname + '/../../src/utils/utils.js');
const { Player } = require(__dirname + '/../../src/server/classes/Player.js');
const { Game } = require(__dirname + '/../../src/server/classes/Game.js');
const fs = require('fs');
const util = require('util');
const axios = require('axios');
axios.defaults.baseURL = "http://localhost:3000/rest";

//Write to answer file and stdout
var log_file = fs.createWriteStream(__dirname + '/answer.txt', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

async function test() {
  var gamePlayer2 = (await axios.get("/game/search/Conrad")).data;
  console.log(gamePlayer2);
  var response = await axios.post("/game/wait/start", gamePlayer2);
  console.log(response.data);
  sleep(5000);
  var gamePlayer2 = (await axios.post("/game/quit/Conrad", gamePlayer2)).data;
  console.log(gamePlayer2);
}

test();
