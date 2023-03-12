const { sleep } = require(__dirname + '/../../src/utils/utils.js');
const { Player } = require(__dirname + '/../../src/server/classes/Player.js');
const { Game } = require(__dirname + '/../../src/server/classes/Game.js');
const { execSync } = require('child_process');
const fs = require('fs');
const util = require('util');
const ReadLines = require('n-readlines');

//Write to answer file and stdout
var log_file = fs.createWriteStream(__dirname + '/answer.txt', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) {
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

async function test() {
	console.log("---------- Database refresh ----------")
	execSync(`cd ${__dirname}/../.. && make refresh_database`, { encoding: 'utf-8' });

	console.log("---------- Account creation ----------")
    const player = new Player();
	await player.connect("Alfred");
    const player2 = new Player();
	await player2.connect("Conrad");
	var _player = new Player();
	await _player.connect("Alfred");
	try {
		const _player = new Player()
		await _player.connect("dwdwdwdwdwdewfregtgt4gfrwfefeefefewfewffw")
	} catch(e) { console.log(e.message); }
	try { const _player = new Player(); await _player.connect("dd dd"); }
	catch(e) { console.log(e.message); }

	console.log("---------- Matchmaking ----------")
  let gamePlayer1 = await player.searchGame();
  gamePlayer1.waitForSomeoneToJoin();
  sleep(6000);
  let gamePlayer2 = await player2.searchGame();
  sleep(4000);
  gamePlayer2.waitGameStart()
  await gamePlayer1.start_play();
  await gamePlayer1.finalScore(10,32);
  console.log("")

	let game2Player2 = await player2.searchGame();
  await gamePlayer2.start_play();
  await game2Player2.finalScore(44);
  sleep(4000);
	let game2Player1 = await player.searchGame();
  sleep(2000);
  await game2Player1.quit(player.name)
  console.log("")

  let game3Player2 = await game2Player2.next_game();
  game2Player1 = await player.searchGame();
  game3Player2.waitForSomeoneToQuit();
  sleep(6000);
  await game2Player1.quit(player.name)
  sleep(4000);

	console.log("---------- Visualize scores ----------")
	console.log(player2.name);
	const gamesPlayer2 = await player2.getAllPastGames();
	for (let i = 0; i < gamesPlayer2.length; i++) {
		let game = gamesPlayer2[i];
		console.log(`${game.player1} vs ${game.player2} -> ${game.player1_score} - ${game.player2_score}`);
	}
  console.log("")

	console.log(player.name);
	const gamesPlayer1 = await player.getAllPastGames();
	for (let i = 0; i < gamesPlayer1.length; i++) {
		let game = gamesPlayer1[i];
		console.log(`${game.player1} vs ${game.player2} -> ${game.player1_score} - ${game.player2_score}`);
	}
	console.log("---------- END ----------")
}

async function compare_results() {
	const solutionRL = new ReadLines(__dirname + '/solution.txt');
	const answerRL = new ReadLines(__dirname + '/answer.txt');
	let solutionLine;
	let answerLine;
	var failed = false;

	while ((solutionLine = solutionRL.next())) {
		answerLine = answerRL.next();
		if (solutionLine.toString('ascii') === answerLine.toString('ascii')) {
			console.log('.');
		} else {
			console.log('X');
			failed = true;
		}
	}
	if (failed) {
		console.log('database, player, game: FAILED')
		process.exit(1);
	} else {
		console.log('database, player, game: SUCCESS')
		process.exit(0);
	}
}

async function start() {
	await test()
	await compare_results();
}

start();
