const { database } = require(__dirname + '/../database/manageDatabase.js');

class Utils {
	constructor() {  }

	async FindGameById(id) {
		if (id == null || id == undefined) {
			console.log("Id in invalid, game could not be found");
			return false;
		}
		const db = new database();
		let game = await db.query("SELECT * FROM game WHERE id = $1", [id]);
        console.log(game)
        db.close_connection();
        if (game != null)
            return game.rows[0];
        console.log("No game with this id found in the databse");
        throw "Game is null";
	}

    async UpdateGame(gameId, playerId, score) {
        console.log("updating game")
        try {
            let game = await this.FindGameById(gameId);
            console.log("game")
            console.log(game)
            const db = new database();
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
            
            await db.query(`UPDATE game SET ${column} = $1 WHERE id = $2`, [score, gameId]);
            db.close_connection();
            console.log("Game successfully updated");
          } catch (error) {
            console.log(error)
            console.log("The game could not be updated");
          }
      
          
	}

}

module.exports.Utils = Utils;