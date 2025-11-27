const { sleep } = require(__dirname + '/../utils/utils.js')
const { Player } = require(__dirname + '/../../src/server/classes/Player.js')
const { Game } = require(__dirname + '/../../src/server/classes/Game.js')
const { execSync } = require('child_process')
const fs = require('fs')
const util = require('util')
const ReadLines = require('n-readlines')

//Write to answer file and stdout
var log_file = fs.createWriteStream(__dirname + '/answer.txt', { flags: 'w' })
var log_stdout = process.stdout
console.log = function (d) {
	log_file.write(util.format(d) + '\n')
	log_stdout.write(util.format(d) + '\n')
}

async function test() {
	console.log('---------- Database refresh ----------')
	execSync(`cd ${__dirname}/../.. && make refresh_database`, {
		encoding: 'utf-8',
	})

	console.log('---------- Account creation ----------')
	const player = new Player()
	await player.connect('Alfred')
	const player2 = new Player()
	await player2.connect('Conrad')
	const player3 = new Player()
	await player3.connect('Philip')
	const player4 = new Player()
	await player4.connect('Jack')
	var _player = new Player()
	await _player.connect('Alfred')
	try {
		const _player = new Player()
		await _player.connect('dwdwdwdwdwdewfregtgt4gfrwfefeefefewfewffw')
	} catch (e) {
		console.log(e.message)
	}
	try {
		const _player = new Player()
		await _player.connect('dd dd')
	} catch (e) {
		console.log(e.message)
	}

	console.log('---------- Matchmaking ----------')
	let gamePlayer1 = await player.createMultiGame()
	await gamePlayer1.waitForSomeoneToJoin()
	await gamePlayer1.waitForSomeoneToJoin()
	//sleep(4000);
	let gamePlayer2 = await player2.createMultiGame()
	await gamePlayer1.waitForSomeoneToJoin()
	//sleep(4000);
	await gamePlayer2.waitGameStart()
	await gamePlayer1.start_play()
	await gamePlayer1.finalScore(10, 32)
	console.log('')

	let soloGamePlayer1 = await player.createSoloGame()
	let soloGamePlayer2 = await player2.createMultiGame()
	await soloGamePlayer2.quit(player2.name)
	await soloGamePlayer1.finalScore(1)
	console.log('')

	let game2Player2 = await player2.createMultiGame()
	await game2Player2.start_play()
	await game2Player2.finalScore(44)
	//sleep(4000);
	let game2Player1 = await player.createMultiGame()
	game2Player2 = await player2.createMultiGame()
	await game2Player1.waitForSomeoneToJoin()
	let game2Player3 = await player3.createMultiGame()
	await game2Player1.waitForSomeoneToJoin()
	await game2Player2.waitForSomeoneToJoin()
	//sleep(2000);
	await game2Player2.start_play()
	await game2Player2.finalScore(23, 54, 33)
	console.log('')

	let game3Player2 = await game2Player2.next_game()
	let game3Player4 = await player4.createMultiGame()
	await game3Player2.waitForSomeoneToJoin()
	await game3Player2.start_play()
	await game3Player4.waitForSomeoneToQuit()
	//sleep(4000);
	game3Player2 = await game3Player2.quit(player2.name)
	await game3Player4.waitForSomeoneToQuit()
	await game3Player4.waitForSomeoneToQuit()
	//sleep(4000);
	game3Player2 = await game3Player2.quit(player.name)
	await game3Player4.waitForSomeoneToQuit()
	await game3Player4.waitForSomeoneToQuit()
	game3Player2 = await game3Player2.finalScore(36, 34)
	game3Player2 = await game3Player2.quit(player4.name)
	await game3Player4.waitForSomeoneToQuit()
	await game3Player4.waitForSomeoneToQuit()
	//sleep(4000);

	console.log('---------- Visualize scores ----------')
	console.log(player2.name)
	const gamesPlayer2 = await player2.getAllPastGames()
	for (let i = 0; i < gamesPlayer2.length; i++) {
		let game = gamesPlayer2[i]
		console.log(
			`${game.player1} vs ${game.player2} -> ${game.player1_score} - ${game.player2_score}`
		)
	}
	console.log('')

	console.log(player.name)
	const gamesPlayer1 = await player.getAllPastGames()
	for (let i = 0; i < gamesPlayer1.length; i++) {
		let game = gamesPlayer1[i]
		console.log(
			`${game.player1} vs ${game.player2} -> ${game.player1_score} - ${game.player2_score}`
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
	await compare_results()
}

start()
