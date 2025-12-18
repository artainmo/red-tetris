const { sleep } = require(__dirname + '/../utils/utils.js')
//const { Player } = require(__dirname + '/../../src/server/classes/Player.js');
//const { Game } = require(__dirname + '/../../src/server/classes/Game.js');
const { execSync, fork } = require('child_process')
const fs = require('fs')
const util = require('util')
const ReadLines = require('n-readlines')
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
	console.log('---------- Database refresh ----------')
	execSync(`cd ${__dirname}/../.. && make refresh_database`, {
		encoding: 'utf-8',
	})

	console.log('---------- Account creation ----------')
	var response = await axios.get('/connect/Alfred')
	console.log(response.status + ':')
	console.log(response.data)
	var response = await axios.get('/connect/Conrad')
	console.log(response.status + ':')
	console.log(response.data)
	var response = await axios.get('/connect/Philip')
	console.log(response.status + ':')
	console.log(response.data)
	try {
		var response = await axios.get(
			'/connect/dwdwdwdwdwdewfregtgt4gfrwfefeefefewfewffw'
		)
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}
	try {
		var response = await axios.get('/connect/dd%20dd')
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}

	console.log('---------- Matchmaking ----------')
	console.log('Create solo game for Alfred:')
	var response = await axios.get('/game/solo/Alfred')
	console.log(response.status + ':')
	console.log(response.data)
	//process.exit()
	console.log('Conrad searches a game:')
	var response = await axios.get('/game/search/Conrad')
	console.log(response.status + ':')
	console.log(response.data)
	console.log('Philip searches a game:')
	var response = await axios.get('/game/search/Philip')
	console.log(response.status + ':')
	console.log(response.data)
	var game = response.data
	//process.exit()
	console.log('Start the game:')
	var response = await axios.patch('/game/start', game)
	console.log(response.status + ':')
	console.log(response.data)
	//process.exit()
	console.log('Conrad quits its game:')
	var response = await axios.patch('/game/quit/Conrad', game)
	console.log(response.status + ':')
	console.log(response.data)
	game = response.data
	//process.exit()
	console.log('Philip creates a game')
	var response = await axios.get('/game/search/Philip')
	game = response.data
	console.log('Verify if someone joined the game:')
	try {
		var response = await axios.post('/game/wait/join', game)
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}
	console.log('Conrad joins the game')
	var response = await axios.get('/game/search/Conrad')
	console.log('Verify if someone joined the game:')
	var response = await axios.post('/game/wait/join', game)
	console.log(response.status + ':')
	console.log(response.data)
	game = response.data
	//var response = await axios.patch("/game/start", game); //Lock the game to avoid errors in future
	//process.exit()
	console.log('Verify if someone quitted the game:')
	try {
		var response = await axios.patch('/game/wait/quit', game)
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}
	console.log('Conrad quits the game')
	var response = await axios.patch('/game/quit/Conrad', game)
	console.log('Verify if someone quitted the game:')
	var response = await axios.patch('/game/wait/quit', game)
	console.log(response.status + ':')
	console.log(response.data)
	game = response.data
	//process.exit()
	console.log('Verify if game got started:')
	try {
		var response = await axios.post('/game/wait/start', game)
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}
	console.log('Conrad joins the game')
	var response = await axios.get('/game/search/Conrad')
	game = response.data
	console.log('Start the game:')
	var response = await axios.patch('/game/start', game)
	console.log('Verify if game got started:')
	var response = await axios.post('/game/wait/start', game)
	console.log(response.status + ':')
	console.log(response.data)
	//process.exit()
	console.log('Send final game score to database wrongfully:')
	var response = await axios.post('/game/score/12/73', game)
	console.log(response.status + ':')
	console.log(response.data)
	game = response.data
	//process.exit()
	console.log('Get next game:')
	var response = await axios.post('/game/next', game)
	console.log(response.status + ':')
	console.log(response.data)
	game = response.data
	var response = await axios.patch('/game/start', game)
	var response = await axios.post('/game/score/42/19', game)
	console.log('Conrad creates new game')
	var response = await axios.get('/game/search/Conrad')
	game = response.data
	console.log('Try to get next game of unfinished game:')
	try {
		var response = await axios.post('/game/next', game)
	} catch (e) {
		console.log(e.response.status + ':')
		console.log(e.response.data)
	}
	//process.exit()
	console.log('Get all games of conrad')
	var response = await axios.get('/games/Conrad')
	console.log(response.status + ':')
	console.log(response.data)
	console.log('Get all games of no-one')
	var response = await axios.get('/games/Noone')
	console.log(response.status + ':')
	console.log(response.data)

	process.exit()
	var gamePlayer1 = (await axios.get('/game/search/Alfred')).data
	console.log(gamePlayer1)
	const child = fork('test_child.js')
	do {
		sleep(2000)
		try {
			var response = await axios.post('/game/wait/join', gamePlayer1)
		} catch (e) {
			response.status = e.response.status
			response.data = e.response.data
		}
	} while (response.status !== 200)
	gamePlayer1 = response.data
	console.log(gamePlayer1)
	sleep(5000)
	var response = (await axios.patch('/game/start', gamePlayer1)).data
	console.log(response)
	sleep(8000)
	var gamePlayer1 = (await axios.post('/game/score/10/32', gamePlayer1)).data
	console.log(gamePlayer1)
	console.log('')

	var game2Player1 = (await axios.get('/game/search/Alfred')).data
	console.log(game2Player1)
	var response = (await axios.patch('/game/start', game2Player1)).data
	console.log(response)
	var game2Player1 = (await axios.post('/game/score/44', game2Player1)).data
	console.log(game2Player1)
	var game2Player2 = (await axios.get('/game/search/Conrad')).data
	console.log(game2Player2)
	sleep(2000)
	var game2Player2 = (await axios.patch('/game/quit/Conrad', game2Player2)).data
	console.log(game2Player2)
	console.log('')

	console.log(game2Player1)
	var game3Player1 = (await axios.post('/game/next', game2Player1)).data
	console.log(game3Player1)
	const child2 = fork('test_child2.js')
	do {
		sleep(2000)
		try {
			var response = await axios.post('/game/wait/join', game3Player1)
		} catch (e) {
			response.status = e.response.status
			response.data = e.response.data
		}
	} while (response.status !== 200)
	game3Player1 = response.data
	var response = (await axios.patch('/game/start', game3Player1)).data
	console.log(response)
	do {
		sleep(2000)
		try {
			var response = await axios.patch('/game/wait/quit', game3Player1)
		} catch (e) {
			response.status = e.response.status
			response.data = e.response.data
		}
	} while (response.status !== 200)
	game3Player1 = response.data
	console.log(game3Player1)
	var game3Player1 = (await axios.patch('/game/quit/Alfred', game3Player1)).data
	console.log(game3Player1)

	console.log('---------- Visualize scores ----------')
	console.log('Conrad')
	const gamesPlayer2 = (await axios.get('/games/Conrad')).data
	for (let i = 0; i < gamesPlayer2.length; i++) {
		let game = gamesPlayer2[i]
		console.log(
			`${game._player1} vs ${game._player2} -> ${game._player1_score} - ${game._player2_score}`
		)
	}
	console.log('')

	console.log('Alfred')
	const gamesPlayer1 = (await axios.get('/games/Alfred')).data
	for (let i = 0; i < gamesPlayer1.length; i++) {
		let game = gamesPlayer1[i]
		console.log(
			`${game._player1} vs ${game._player2} -> ${game._player1_score} - ${game._player2_score}`
		)
	}
	console.log('---------- END ----------')
}

async function compare_results() {
	const solutionRL = new ReadLines(__dirname + '/solution.txt')
	const answerRL = new ReadLines(__dirname + '/answer.txt')
	let solutionLine
	let answerLine
	var failed = false

	while ((solutionLine = solutionRL.next())) {
		answerLine = answerRL.next()
		if (solutionLine.toString('ascii') === answerLine.toString('ascii')) {
			process.stdout.write('\x1b[32m . \x1b[0m')
		} else {
			process.stdout.write('\x1b[31m X \x1b[0m')
			failed = true
		}
	}
	process.stdout.write('\n')
	if (failed) {
		console.log('database, player, game: \x1b[31mFAILED\x1b[0m')
		process.exit(1)
	} else {
		console.log('database, player, game: \x1b[32mSUCCESS\x1b[0m')
		process.exit(0)
	}
}

async function start() {
	await test()
	//await compare_results();
}

start()
