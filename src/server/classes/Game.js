const { database } = require(__dirname + '/../database/manageDatabase.js');
const { sleep } = require(__dirname + '/../../utils/utils.js');

class Game {
	constructor(id=null, player1=null, player2=null, player1_score=null, player2_score=null) { //optional parameters...
		this._id = id;
		this._player1 = player1;
		this._player2 = player2;
		this._player1_score = player1_score;
		this._player2_score = player2_score;
	}

	async waitForSomeoneToJoin() {
		if (this._id === null || this._player1 === null || this._player2 !== null) {
			console.log("This game cannot be joined");
			return false;
		}
		const db = new database();
		while (this._player2 === null) {
			console.log(`No one joined ${this._player1}'s game`);
			sleep(2000);
			let joinableGame = await db.query("SELECT player2_id FROM game WHERE id = $1", [this._id]);
			this._player2 = joinableGame.rows[0].player2_id;
		}
		console.log(`${this._player1}: ${this._player2} joined ${this.player1}'s game`);
		db.close_connection();
		return true;
	}

	async waitForSomeoneToQuit() {
		if (this._id === null || this._player1 === null || this._player2 === null) {
			console.log("This game cannot be quited");
			return false;
		}
		const db = new database();
		while (this._player2 !== null) {
			console.log(`No one quited ${this._player1}'s game`);
			sleep(2000);
			let quittableGame = await db.query("SELECT * FROM game WHERE id = $1", [this._id]);
			this._player2 = quittableGame.rows[0].player2_id;
			this._player1 = quittableGame.rows[0].player1_id;
		}
		console.log(`${this._player1}: Someone quited ${this.player1}'s game`);
		db.close_connection();
		return true;
	}

	async start_play() {
		if (this._id === null || this._player1 === null) {
			console.log("Unable to start this game")
			return false;
		}
		const db = new database();
		await db.query("UPDATE game SET locked = true WHERE id = $1", [this._id])
		db.close_connection();
		console.log(`Game started between ${this._player1} and ${this._player2}`)
		return true
	}

	async waitGameStart() {
		if (this._id === null || this._player1 === null || this._player2 === null) {
			console.log("This game cannot be started");
			return false;
		}
		const db = new database();
		while (1) {
			console.log(`${this._player1}'s game not started yet`);
			sleep(2000);
			let game = await db.query("SELECT locked FROM game WHERE id = $1", [this._id]);
			if (game.rows[0].locked === true) { break; }
		}
		console.log(`${this.player1} started the game`);
		db.close_connection();
		return true;
	}

	async finalScore(score1, score2=null) {
		if (this._id === null || this._player1 === null) {
			console.log("Final game score cannot be added")
			return false;
		}
		const db = new database();
		this._player1_score = score1;
		await db.query("UPDATE game SET player1_score = $1 WHERE id = $2;", [this._player1_score, this._id]);
		if (this._player2 !== null) {
			this._player2_score = score2;
			await db.query("UPDATE game SET player2_score = $1 WHERE id = $2;", [this._player2_score, this._id]);
		}
		db.close_connection();
		console.log(`Game of ${this._player1} and ${this._player2} scored ${this._player1_score} and ${this._player2_score}`);
		return true;
	}

	async next_game() {
		if (this._id === null || this._player1 === null || this._player1_score === null) {
			console.log("This game is not finished. Can't go to next game.")
			return false;
		}
		const db = new database();
		if (this._player2_score === null || this._player1_score > this._player2_score) {
			var winner = this._player1;
			var loser = this._player2;
		} else {
			var winner = this._player2;
			var loser = this._player1;
		}
		if (loser === null) {
			await db.query("INSERT INTO game (player1_id) VALUES ($1)", [winner])
			var newGame = await db.query("SELECT * FROM game WHERE locked = false AND player1_id = $1 AND player2_id IS NULL;", [winner])
		} else {
			await db.query("INSERT INTO game (player1_id, player2_id) VALUES ($1, $2)", [winner, loser])
			var newGame = await db.query("SELECT * FROM game WHERE locked = false AND player1_id = $1 AND player2_id = $2;", [winner, loser])
		}
		db.close_connection();
		console.log(`Next game matchmaking with ${newGame.rows[0].player1_id} and ${newGame.rows[0].player2_id}`)
		return new Game(newGame.rows[0].id, newGame.rows[0].player1_id, newGame.rows[0].player2_id);
	}

	async quit(username) {
		const db = new database();
		if (username === this._player1) {
			if (this._player2 !== null) {
				await db.query("UPDATE game SET player1_id = $1 WHERE id = $1", [this._player2, this._id])
				this._player1 = this._player2;
				await db.query("UPDATE game SET player2_id = null WHERE id = $1", [this._id])
				this._player2 = null;
			} else {
				await db.query("DELETE FROM game WHERE id = $1", [this._id]);
				this._player1 = null;
			}
		} else if (username === this._player2) {
			await db.query("UPDATE game SET player2_id = null WHERE id = $1", [this._id])
			this._player2 = null;
		} else {
			console.log(`${username} is unable to quit ${this._player1} and ${this._player2}'s game`)
			db.close_connection();
			return false;
		}
		db.close_connection();
		console.log(`${username} quited the game. ${this._player1} is left`)
		return true;
	}

	set id(value) {
		this._id = value;
	}

	get id() {
		return this._id;
	}

	set player1(value) {
		this._player1 = value;
	}

	get player1() {
		return this._player1;
	}

	set player2(value) {
		this._player2 = value;
	}

	get player2() {
		return this._player2;
	}

	get player1_score() {
		return this._player1_score;
	}

	get player2_score() {
		return this._player2_score;
	}
}

module.exports.Game = Game;
