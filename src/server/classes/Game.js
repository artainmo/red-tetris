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

	async finalScore(score1, score2) {
		if (this._id === null) {
			console.log("Final game score cannot be added")
			return false;
		}
		this._player1_score = score1;
		this._player2_score = score2;
		const db = new database();
		await db.query("UPDATE game SET player1_score = $1 WHERE id = $2;", [this._player1_score, this._id]);
		await db.query("UPDATE game SET player2_score = $1 WHERE id = $2;", [this._player2_score, this._id]);
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
