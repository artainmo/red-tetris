const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "admin",
    database: "red_tetris"
})

class Utils {
	constructor() {  }

	async FindGameById(id) {
		if (id == null || id == undefined) {
			console.log("Id in invalid, game could not be found");
			return false;
		}
		//const db = new database();
		let game = await pool.query("SELECT * FROM game WHERE id = $1", [id]);
        console.log(game)
        //db.close_connection();
        if (game != null)
            return game.rows[0];
        console.log("No game with this id found in the databse");
        throw "Game is null";
	}

    async UpdateGame(gameId, playerId, score) {
        console.log("updating game")
        try {
            let game = await this.FindGameById(gameId);
            //const db = new database();
            let column;
            switch (playerId) {
              case game.player1_id:
                column = 'player1_score';
                break;
              case game.player2_id:
                column = 'player2_score';
                break;
              case game.player3_id:
                column = 'player3_score';
                break;
              case game.player4_id:
                column = 'player4_score';
                break;
              case game.player5_id:
                column = 'player5_score';
                break;
              case game.player6_id:
                column = 'player6_score';
                break;
              default:
                return res.status(400).send({ message: 'Invalid player ID' });
            }
            
            await pool.query(`UPDATE game SET ${column} = $1 WHERE id = $2`, [score, gameId]);
            //db.close_connection();
            console.log("Game successfully updated");
          } catch (error) {
            console.log(error)
            console.log("The game could not be updated");
          }          
	}

  async GetAllGames() {
		//const db = new database();
		const games = await pool.query("SELECT * FROM game");
		//db.close_connection();
		return games.rows;
  }

  async GetJoinableGames() {                    {/* this is for rooms in front */}
		//const db = new database();
		const games = await pool.query("SELECT * FROM game WHERE locked = false AND player6_id IS NULL");
		//db.close_connection();
		return games.rows;
  }

  async createMultiGame(username) {				{/* previously : searchGame */}
    const game = await pool.query("INSERT INTO game (player1_id) VALUES ($1) RETURNING *;", [username]);
    console.log(`${username}: ${username} created a joinable game`)
    return game.rows[0];
  }

  
  async joinMultiGame(id, username) {				{/* join existing game */}
    const game = await this.FindGameById(id);
    if (game != null) { 
      if (!game.player2_id) {
        await pool.query("UPDATE game SET player2_id = $1 WHERE id = $2", [username, game.id]);
        game.player2_id = username;
      } else if (!game.player3_id) {
        await pool.query("UPDATE game SET player3_id = $1 WHERE id = $2", [username, game.id]);
        game.player3_id = username;
      } else if (!game.player4_id) {
        await pool.query("UPDATE game SET player4_id = $1 WHERE id = $2", [username, game.id]);
        game.player4_id = username;
      } else if (!game.player5_id) {
        await pool.query("UPDATE game SET player5_id = $1 WHERE id = $2", [username, game.id]);
        game.player5_id = username;
      } else {
        await pool.query("UPDATE game SET player6_id = $1 WHERE id = $2", [username, game.id]);
        game.player6_id = username;
      }
      console.log(`${username}: ${username} joined ${game.player1_id}'s game`)
    return game;
    }
  }

}

module.exports.Utils = Utils;