const { sleep } = require(__dirname + '/../utils/utils.js')
const { Player } = require(__dirname + '/../../src/server/classes/Player.js')
const { Game } = require(__dirname + '/../../src/server/classes/Game.js')
const fs = require('fs')
const util = require('util')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/rest'

//Write to answer file and stdout
var log_file = fs.createWriteStream(__dirname + '/answer.txt', { flags: 'w' })
var log_stdout = process.stdout
console.log = function (d) {
	log_file.write(util.format(d) + '\n')
	log_stdout.write(util.format(d) + '\n')
}

async function test() {
	var response = { status: 400, data: 'failed' }
	var gamePlayer2 = (await axios.get('/game/search/Conrad')).data
	console.log(gamePlayer2)
	do {
		sleep(2000)
		try {
			var response = await axios.post('/game/wait/start', gamePlayer2)
		} catch (e) {
			response.status = e.response.status
			response.data = e.response.data
		}
	} while (response.status !== 200)
	console.log(response.data)
}

test()
