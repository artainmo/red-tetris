const { database } = require(__dirname + '/../database/manageDatabase.js');
const { Game } = require(__dirname + '/Game.js');

class Player {
	async connect(username) { //Create new account or connect to already existing one

		if (username.length > 19) {
			throw new Error("Player's username is too long");
		}
		var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(username)) {
			throw new Error("Player's username contains special characters");
		}
		this._username = username;
		await this.tryAccountCreation(username);
	}

	async tryAccountCreation(username) {
		const db = new database(false);
		await db.connectToDatabase();
		try {
			await db.query("INSERT INTO account (username) VALUES ($1);", [username]);
			console.log(`New account created named ${username}`);
		} catch(e) {
			if (e.code === "23505") {
				console.log(`Logged into account named ${username}`);
			} else {
				console.log(e.message.substr(0,61));
				db.close_connection();
				process.exit(1);
			}
		}
		db.close_connection();
	}

	get name() {
		return this._username;
	}

	async getAllPastGames() {
		let games = [];
		const db = new database();
		const sql_games = await db.query("SELECT * FROM game WHERE locked = true AND player1_id = $1 OR player2_id = $1", [this._username]);
		for (let i=0; i<sql_games.rows.length; i++) {
			let game = sql_games.rows[i];
			games.push(new Game(game.id, game.player1_id, game.player2_id, game.player1_score, game.player2_score));
		}
		db.close_connection();
		return games;
	}

	async searchGame() {
		const game = new Game();
		const db = new database();
		const openGames = await db.query("SELECT * FROM game WHERE locked = false AND player2_id IS NULL");
		if (openGames.rows.length !== 0) { //Join existing game
			await db.query("UPDATE game SET player2_id = $1 WHERE id = $2", [this._username, openGames.rows[0].id]);
			game.id = openGames.rows[0].id
			game.player1 = openGames.rows[0].player1_id;
			game.player2 = this._username;
			console.log(`${this._username}: ${this._username} joined ${game.player1}'s game`)
		} else { //Create joinable game
			await db.query("INSERT INTO game (player1_id) VALUES ($1);", [this._username]);
			const newGame = await db.query("SELECT id FROM game WHERE locked = false AND player1_id = $1 AND player2_id IS NULL;", [this._username]);
			game.id = newGame.rows[0].id
			game.player1 = this._username;
			console.log(`${this._username} created a joinable game`)
		}
		db.close_connection();
		return game;
	}

	async createSoloGame() {
		const game = new Game();
		const db = new database();
		await db.query("INSERT INTO game (player1_id) VALUES ($1);", [this._username]);
		const newGame = await db.query("SELECT id FROM game WHERE locked = false AND player1_id = $1 AND player2_id IS NULL;", [this._username]);
		game.id = newGame.rows[0].id
		game.player1 = this._username;
		db.close_connection();
		if !game.start_play() { //Lock the game down so that no-one will join
			return false
		}
		return game;
	}
}

module.exports.Player = Player;
