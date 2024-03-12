const { database } = require(__dirname + '/../database/manageDatabase.js');

class Game {
	constructor(id=null, player1=null, player2=null, player3=null, player4=null, player5=null, player6=null,
					player1_score=null, player2_score=null, player3_score=null, player4_score=null, player5_score=null, player6_score=null,) { //optional parameters...
		this._id = id;
		this._player1 = player1;
		this._player2 = player2;
		this._player3 = player3;
		this._player4 = player4;
		this._player5 = player5;
		this._player6 = player6;
		this._player1_score = player1_score;
		this._player2_score = player2_score;
		this._player3_score = player3_score;
		this._player4_score = player4_score;
		this._player5_score = player5_score;
		this._player6_score = player6_score;
	}

	display() {
		const text = `${this._player1} vs ${this._player2}` +
					` - ${this._player1_score} : ${this._player2_score}`
		console.log(text);
		return text;
	}

	async waitForSomeoneToJoin() {
		if (this._id === null || this._player1 === null || this._player6 !== null) {
			console.log("This game cannot be joined");
			return false;
		}
		const db = new database();
		let initial_number_players = 0;
		let new_number_players = 0;
		let joinablePlayers = [this._player2, this._player3, this._player4, this._player5, this._player6];
		for (let i = 0; i < 5; i++) {
			if (joinablePlayers[i] != null) {
				initial_number_players++;
			}
		}
		let joinableGame = await db.query("SELECT player2_id, player3_id, player4_id, player5_id, player6_id FROM game WHERE id = $1", [this._id]);
		this._player2 = joinableGame.rows[0].player2_id;
		this._player3 = joinableGame.rows[0].player3_id;
		this._player4 = joinableGame.rows[0].player4_id;
		this._player5 = joinableGame.rows[0].player5_id;
		this._player6 = joinableGame.rows[0].player6_id;
		joinablePlayers = [this._player2, this._player3, this._player4, this._player5, this._player6];
		for (let i = 0; i < 5; i++) {
			if (joinablePlayers[i] != null) {
				new_number_players++;
			}
		}
		if (new_number_players <= initial_number_players) {
			console.log(`${this._player1}: No one joined ${this._player1}'s game`);
			db.close_connection();
			return false;
		} else {
			console.log(`${this._player1}: Someone joined ${this._player1}'s game`);
			db.close_connection();
			return this;
		}
	}

	async waitForSomeoneToQuit() {
		if (this._id === null || this._player1 === null || this._player2 === null) {
			console.log("This game cannot be quited");
			return false;
		}
		const db = new database();
		let initial_number_players = 0;
		let new_number_players = 0;
		let quittablePlayers = [this._player2, this._player3, this._player4, this._player5, this._player6];
		for (let i = 0; i < 5; i++) {
			if (quittablePlayers[i] != null) {
				initial_number_players++;
			}
		}
		let quittableGame = await db.query("SELECT * FROM game WHERE id = $1", [this._id]);
		this._player2 = quittableGame.rows[0].player2_id;
		this._player3 = quittableGame.rows[0].player3_id;
		this._player4 = quittableGame.rows[0].player4_id;
		this._player5 = quittableGame.rows[0].player5_id;
		this._player6 = quittableGame.rows[0].player6_id;
		quittablePlayers = [this._player2, this._player3, this._player4, this._player5, this._player6];
		for (let i = 0; i < 5; i++) {
			if (quittablePlayers[i] != null) {
				new_number_players++;
			}
		}
		if (new_number_players >= initial_number_players) {
			console.log(`${this._player1}: No one quited ${this._player1}'s game`);
			db.close_connection();
			return false;
		} else {
			console.log(`${this._player1}: Someone quited ${this._player1}'s game`);
			db.close_connection();
			return this;
		}
	}

	async waitGameStart() {
		if (this._id === null || this._player1 === null || this._player2 === null) {
			console.log("This game cannot be started");
			return false;
		}
		const db = new database();
		let game = await db.query("SELECT locked FROM game WHERE id = $1", [this._id]);
		if (game.rows[0].locked !== true) {
			console.log(`${this._player1}'s game not started yet`);
			db.close_connection();
			return false;
		} else {
			console.log(`${this._player2}: ${this._player1} started the game`);
			db.close_connection();
			return true;
		}
	}

	async start_play() {
		if (this._id === null || this._player1 === null) {
			console.log("Unable to start this game")
			return false;
		}
		const db = new database();
		await db.query("UPDATE game SET locked = true WHERE id = $1", [this._id])
		db.close_connection();
		console.log(`${this._player1}: Game started between ${this._player1} and ${this._player2} and ${this._player3}`)
		return true
	}

	async finalScore(score1, score2=null, score3=null, score4=null, score5=null, score6=null) {
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
		if (this._player3 !== null) {
			this._player3_score = score3;
			await db.query("UPDATE game SET player3_score = $1 WHERE id = $2;", [this._player3_score, this._id]);
		}
		if (this._player4 !== null) {
			this._player4_score = score4;
			await db.query("UPDATE game SET player4_score = $1 WHERE id = $2;", [this._player4_score, this._id]);
		}
		if (this._player5 !== null) {
			this._player5_score = score5;
			await db.query("UPDATE game SET player5_score = $1 WHERE id = $2;", [this._player5_score, this._id]);
		}
		if (this._player6 !== null) {
			this._player6_score = score6;
			await db.query("UPDATE game SET player6_score = $1 WHERE id = $2;", [this._player6_score, this._id]);
		}
		db.close_connection();
		console.log(`Game of ${this._player1} and ${this._player2} and ${this._player3} scored ${this._player1_score} and ${this._player2_score} and ${this._player3_score}`);
		return this;
	}

	async next_game() {
		if (this._id === null || this._player1 === null || this._player1_score === null) {
			console.log("This game is not finished. Can't go to next game.")
			return false;
		}
		const db = new database();
		var scores = [this._player1_score, this._player2_score, this._player3_score, this._player4_score,
					this._player5_score, this._player6_score];
		var players = [this._player1, this._player2, this._player3, this._player4, this._player5, this._player6];
		var winner = [0, null, null]; //The winner needs to be found as he will be host of next game
		for (let i = 0; i < 6; i++) {
			if (scores[i] > winner[0]) {
				winner = [scores[i], players[i], i];
			}
		}
		players[winner[2]] = players[0]
		players[0] = winner[1]
		await db.query("INSERT INTO game (player1_id, player2_id, player3_id, player4_id, " +
				"player5_id, player6_id) VALUES ($1, $2, $3, $4, $5, $6)", players)
		var newGame = await db.query("SELECT * FROM game WHERE locked = false AND player1_id = $1", [players[0]])
		db.close_connection();
		console.log(`Next game matchmaking with ${newGame.rows[0].player1_id} ` +
					`and ${newGame.rows[0].player2_id} and ${newGame.rows[0].player3_id} ` +
					`and ${newGame.rows[0].player4_id} and ${newGame.rows[0].player5_id} ` +
					`and ${newGame.rows[0].player6_id}`)
		return new Game(newGame.rows[0].id, newGame.rows[0].player1_id, newGame.rows[0].player2_id,
						newGame.rows[0].player3_id, newGame.rows[0].player4_id, newGame.rows[0].player5_id,
						newGame.rows[0].player6_id);
	}

	async reorder_players(start) {
		//const players = [this._player1, this._player2, this._player3, this._player4, this._player5, this._player6];
		//const _players = ["player1_id", "player2_id", "player3_id", "player4_id", "player5_id", "player6_id"];
		const db = new database();

		//console.log(`${this._player1} | ${this._player2} | ${this._player3} | ${this._player4}`)
		for (var i = start; i < 5; i++) {
			//console.log(`${i}: ${this._player1} | ${this._player2} | ${this._player3} | ${this._player4}`)
			if (i == 0) {
				this._player1 = this._player2;
				await db.query("UPDATE game SET player1_id = $1 WHERE id = $2", [this._player2, this._id]);
			} else if (i == 1) {
				this._player2 = this._player3;
				await db.query("UPDATE game SET player2_id = $1 WHERE id = $2", [this._player3, this._id]);
			} else if (i == 2) {
				this._player3 = this._player4;
				await db.query("UPDATE game SET player3_id = $1 WHERE id = $2", [this._player4, this._id]);
			} else if (i == 3) {
				this._player4 = this._player5;
				await db.query("UPDATE game SET player4_id = $1 WHERE id = $2", [this._player5, this._id]);
			} else if (i == 4) {
				this._player5 = this._player6;
				await db.query("UPDATE game SET player5_id = $1 WHERE id = $2", [this._player6, this._id]);
			}
		}
		//console.log(`${this._player1} | ${this._player2} | ${this._player3} | ${this._player4}`)
		db.close_connection();
	}

	async quit(username) {
		if (username === this._player1) {
			if (this._player2 !== null) {
				await this.reorder_players(0);
			} else {
				const db = new database();
				await db.query("DELETE FROM game WHERE id = $1", [this._id]);
				db.close_connection();
				this._player1 = null;
			}
		} else if (username === this._player2) {
			await this.reorder_players(1);
		} else if (username === this._player3) {
			await this.reorder_players(2);
		} else if (username === this._player4) {
			await this.reorder_players(3);
		} else if (username === this._player5) {
			await this.reorder_players(4);
		} else if (username === this._player6) {
			await this.reorder_players(5);
		} else {
			console.log(`${username} is unable to quit ${this._player1} and ${this._player2}'s game`)
			return false;
		}
		console.log(`${username} quited the game. Game now looks like ${this._player1}, ${this._player2}, ${this._player3}`)
		return this;
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

	set player3(value) {
		this._player3 = value;
	}

	get player3() {
		return this._player3;
	}

	set player4(value) {
		this._player4 = value;
	}

	get player4() {
		return this._player4;
	}

	set player5(value) {
		this._player5 = value;
	}

	get player5() {
		return this._player5;
	}

	set player6(value) {
		this._player6 = value;
	}

	get player6() {
		return this._player6;
	}

	get player1_score() {
		return this._player1_score;
	}

	get player2_score() {
		return this._player2_score;
	}

	get player3_score() {
		return this._player3_score;
	}

	get player4_score() {
		return this._player4_score;
	}

	get player5_score() {
		return this._player5_score;
	}

	get player6_score() {
		return this._player6_score;
	}
}

module.exports.Game = Game;
