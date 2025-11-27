const { Player } = require('./Player');
const { Game } = require('./Game');

class Utils {
	constructor() {  }

	async FindGameById(db, id) {
    try {
		  if (id == null || id == undefined) {
			console.log("Id in invalid, game could not be found");
      throw "Id is null";
      }
		//const db = new database();
		let game = await db.query("SELECT * FROM game WHERE id = $1", [id]);
        //db.close_connection();
        if (game != null) 
            return game.rows[0];
        console.log("No game with this id found in the databse");
        // throw "Game is null";
    } catch (error) {
        console.log("The game could not be found");
        return null;
    }
	}

    async UpdateGame(db, gameId, playerId, score) {
        console.log("updating game")
        try {
            const game = await db.query(`UPDATE player SET score = $1 WHERE game_id = $2 AND username = $3 RETURNING *`, [score, gameId, playerId]);
            if (game.rows.length === 0) {
                console.log("Invalid player or id");
                return;
            }
            
            // await pool.query(`UPDATE game SET ${column} = $1 WHERE id = $2`, [score, gameId]);
            //db.close_connection();
            console.log("Game successfully updated");
          } catch (error) {
            console.log(error)
            console.log("The game could not be updated");
          }          
	}

  // async GetAllGames(db) {
	// 	const games = await db.query("SELECT * FROM game");
	// 	return games.rows;
  // }

  // async GetJoinableGames(db) {                    {/* this is for rooms in front */}
	// 	const games = await db.query("SELECT * FROM game WHERE locked = false");
	// 	return games.rows;
  // }

  async BuildGameFromId(db, gameId) {
    const gameRow = await this.FindGameById(db, gameId);
    if (!gameRow) throw new Error('Game not found');

    // const players = await this.findPlayersByGameId(db, gameId);

    return new Game(gameRow.id, gameRow.locked, gameRow.finished, gameRow.host);
  }

  async createMultiGame(db, username, id) {
    				{/* previously : searchGame */}
    var resGame;
    console.log("Creating a new multiplayer game");
    if (id == null) {
      resGame = await db.query('INSERT INTO game (host) VALUES ($1) RETURNING *;', [username]);
    } else {
      console.log("Creating a new multiplayer game with ID:", id);
      if (id.length < 3) {
        throw "Game ID too short, must be at least 3 characters";
      }
      resGame = await db.query('INSERT INTO game (id, host) VALUES ($1, $2) RETURNING *;', [id, username]);
    }
    const gameID = resGame.rows[0].id;
    
    await db.query(
      'INSERT INTO player (username, game_id) VALUES ($1, $2);',
      [username, gameID]
    );
    console.log(`${username}: ${username} created a joinable game`)
    const game = await this.BuildGameFromId(db, gameID);
    return game;
  }

  async findPlayersByGameId(db, gameId){
    const sql_players = await db.query("SELECT * FROM player WHERE game_id = $1", [gameId]);
    let players = [];
    for (let i = 0; i < sql_players.rows.length; i++) {
        let playerData = sql_players.rows[i];
        let player = new Player(playerData.username, playerData.game_id, playerData.score);
        players.push(player);
    }
    return players;
  }

  async joinMultiGame(db, id, username) {				{/* join existing game */}
    try {
      const game = await this.FindGameById(db, id);
      if (game != null) {
        if (!game.locked) {

          const existing = await db.query("SELECT 1 FROM player WHERE username = $1 AND game_id = $2", [username, game.id]);
          if (existing.rows.length === 0) {
            await db.query("INSERT INTO player (username, game_id) VALUES ($1, $2);", [username, game.id]);
          } else {
            console.log(`${username} is already in game ${game.id}, skipping insert`);
          }
          console.log(`${username}: ${username} joined ${game.host}'s game`)
          const res = await this.BuildGameFromId(db, id);
          return res;
        }
        else {
          console.log("Game is locked, cannot join");
          throw "Game is locked";
        }
      }
      else {
        console.log("Game not found, creating a new one with id "+ id);
        return await this.createMultiGame(db, username, id);
      }

    } catch (error) {
      console.log("The game could not be joined");
      throw error;
    }
  }

  async startGame(db, id) {
    await db.query("UPDATE game SET locked = TRUE WHERE id = $1;", [id]);
    console.log(`Game ${id} has started and is now locked`);
  }

  async deleteUserFromWaitingRoom(db, username, room) {
    await db.query("DELETE FROM player WHERE username = $1 AND game_id = $2;", [username, room.id]);
    const playerCountInRoom = await db.query("SELECT * FROM player WHERE game_id = $1;", [room.id]);
    if (playerCountInRoom.rows.length == 0) {
      await db.query("DELETE FROM game WHERE id = $1;", [room.id]);
      console.log(`Room ${room.id} has been deleted as it became empty`);
    }
    else {
      console.log(`Room ${room.id} still has players, so it was not deleted`);
    }
    console.log(`${username} has been removed from room ${room.id}`);
  }

  async deleteUserFromActiveGame(db, username, game) {
    await db.query("UPDATE player SET is_in_game = FALSE WHERE username = $1 AND game_id = $2;", [username, game.id]);
    playersInGame = await db.query("SELECT * FROM player WHERE game_id = $1 AND is_in_game = TRUE;", [game.id]);
    if (playersInGame.rows.length == 0) {
      await db.query("UPDATE game SET finished = TRUE WHERE id = $1;", [game.id]);
    }
    console.log(`${username} has been removed from active game ${game.id}`);
  }

  async deleteUserFromAllRooms(db, socket, socketRooms, username) {
    const rooms = await db.query("SELECT g.* FROM game g INNER JOIN player p ON g.id = p.game_id WHERE p.username = $1 AND p.is_in_game = TRUE AND (g.locked = false OR g.finished = false);", [username]);
    for (let i=0; i<rooms.rows.length; i++) {
      if (rooms.rows[i].locked){
        await this.deleteUserFromActiveGame(db, socket, username, rooms.rows[i]);
      } 
      else {
        await this.deleteUserFromWaitingRoom(db, username, rooms.rows[i]);
      }
    }
  }

  async getUserScores(db, username) {
    try {
      const scores = await db.query("SELECT score, created_at, game_id FROM player WHERE username = $1 ORDER BY created_at DESC;", [username]);
      return scores.rows.map(row => ({ score: row.score, createdAt: row.created_at, gameId: row.game_id }));
    } catch (error) {
      console.log("Could not retrieve user scores:", error);
      throw error;
    }
  }

  async getBestScores(db) {
    try {
      const scores = await db.query("SELECT username, MAX(score) AS best_score FROM player GROUP BY username ORDER BY best_score DESC LIMIT 10;");
      return scores.rows.map(row => ({ username: row.username, bestScore: row.best_score }));
    } catch (error) {
      console.log("Could not retrieve best scores:", error);
      throw error;
    }
  }
}

module.exports.Utils = Utils;