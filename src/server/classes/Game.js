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

	async start() {
		if (this._id === null || this._player1 === null) {
			console.log("Unable to start this game")
			return false;
		}
		const db = new database();
		await db.query("UPDATE game SET locked = true WHERE id = $1", [this._id])
		db.close_connection();
		return true
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
		return true;
	}

	async next() {
		if (this._id === null || this._player1 === null || this._player1_score === null) {
			console.log("This game is not finished. Can't go to next game.")
			return false;
		}
		const db = new database();
		if (this._player2_score === null || this._player1_score > this._player2_score) {
			const winner = this._player1;
			const loser = this._player2;
		} else {
			const winner = this._player2;
			const loser = this._player1;
		}
		await db.query("INSERT INTO game (player1_id, player2_id) VALUES ($1, $2)", [winner, loser])
		const newGame = await db.query("SELECT * FROM game WHERE locked = false AND player1_id = $1 AND player2_id = $2;", [winner, loser])
		db.close_connection();
		return Game(newGame.rows[0].id, newGame.rows[0]._player1_id, newGame.rows[0]._player2_id);
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
			console.log(`${username} is unable to quit ${this._player1} and ${this._player2}'s game'`)
			db.close_connection();
			return false;
		}
		db.close_connection();
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
