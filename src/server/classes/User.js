const { database } = require(__dirname + '/../database/manageDatabase.js');
const { Game } = require(__dirname + '/Game.js');
const { Utils } = require(__dirname + '/Utils.js');

class User {
	async connect(db, username) { //Create new account or connect to already existing one
		if (username.length > 19) {
			throw new Error("Player's username is too long");
		}
		var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (format.test(username)) {
			throw new Error("Player's username contains special characters");
		}
		this._username = username;
		await this.tryAccountCreation(db, username);
	}

	async tryAccountCreation(db, username) {
		console.log("Connecting to database...");
		// await db.connectToDatabase();
		console.log(db);
		console.log("Connected.");
		try {
			await db.query("INSERT INTO account (username) VALUES ($1);", [username]);
			console.log(`New account created named ${username}`);
		} catch(e) {
			if (e.code === "23505") {
				console.log(`Logged into account named ${username}`);
			} else {
				console.log(e.message.substr(0,61));
				process.exit(1);
			}
		}
	}

	get name() {
		return this._username;
	}

	async getAllPastGames(db, username) {
		let games = [];
		const sql_games = await db.query(
			"SELECT g.* FROM game g INNER JOIN player p ON g.id = p.game_id WHERE p.username = $1;",
			[username]
		);
		for (let i=0; i<sql_games.rows.length; i++) {
			let game = sql_games.rows[i];
			games.push(new Game(db, game.id, game.locked, game.finished, game.winner, game.host));
		}
		return games;
	}

	async searchOrCreateMultiGame(username) {				{/* previously : searchGame */}
		const db = new database();
		const openGames = showJoinableGames();
		if (openGames.length !== 0) { //Join existing game
			const game = openGames[0]
			// if (!game.player2_id) {
			// 	await db.query("UPDATE game SET player2_id = $1 WHERE id = $2", [username, game.id]);
			// 	game.player2 = username;
			// } else if (!game.player3_id) {
			// 	await db.query("UPDATE game SET player3_id = $1 WHERE id = $2", [username, game.id]);
			// 	game.player3 = username;
			// } else if (!game.player4_id) {
			// 	await db.query("UPDATE game SET player4_id = $1 WHERE id = $2", [username, game.id]);
			// } else if (!game.player5_id) {
			// 	await db.query("UPDATE game SET player5_id = $1 WHERE id = $2", [username, game.id]);
			// } else {
			// 	await db.query("UPDATE game SET player6_id = $1 WHERE id = $2", [username, game.id]);
			// }
			await db.query("INSERT INTO player (username, game_id) VALUES ($1, $2);", [username, game.id]);

			console.log(`${username}: ${username} joined ${game.player1_id}'s game`)
		} else {
			const newGame = await db.query("INSERT INTO game (host) VALUES ($1) RETURNING *;", [username]);
			game.id = newGame.rows[0].id
			game.player1 = username;
			console.log(`${username}: ${username} created a joinable game`)
		}
		return game;
	}

	async showJoinableGames(db) {				{/* this is for the Rooms in the front */}
		const openGames = await db.query("SELECT * FROM game WHERE locked = false");
		return openGames.rows;
	}

	async createSoloGame(db, username) {
		const resGame = await db.query('INSERT INTO game (host) VALUES ($1) RETURNING id;', [username]);
		const gameId = resGame.rows[0].id;
		console.log(`Solo game created with id ${gameId} for player ${username}`);
		await db.query(
			'INSERT INTO player (username, game_id) VALUES ($1, $2);',
			[username, gameId]
		);
		const gamebase = await db.query("SELECT * FROM game WHERE id = $1;", [gameId]);
		const utils = new Utils();
		const game = await utils.BuildGameFromId(db, gameId);
		if (!await game.start_play(db)) {
			return false;
		}
		console.log(`${username}: ${game.host} started a solo game`)
		return game;
	}
}

module.exports.User = User;
