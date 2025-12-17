const { Game } = require('./Game')

class Utils {
	constructor() {}

	async FindGameById(db, id) {
		try {
			if (id === null || id === undefined) {
				console.log('Id in invalid, game could not be found')
				throw 'Id is null'
			}
			const game = await db.query('SELECT * FROM game WHERE id = $1', [id])
			if (game !== null) {
				return game.rows[0]
			}
			console.log('No game with this id found in the database')
		} catch {
			console.log('The game could not be found')
			return null
		}
	}

	async getUserScores(db, username) {
		try {
			const scores = await db.query(
				'SELECT score, created_at, game_id FROM player WHERE username = $1 ORDER BY created_at DESC;',
				[username]
			)
			return scores.rows.map((row) => ({
				score: row.score,
				createdAt: row.created_at,
				gameId: row.game_id,
			}))
		} catch (error) {
			console.log('Could not retrieve user scores:', error)
			throw error
		}
	}

	async getBestScores(db) {
		try {
			const scores = await db.query(
				'SELECT username, MAX(score) AS best_score FROM player GROUP BY username ORDER BY best_score DESC LIMIT 10;'
			)
			return scores.rows.map((row) => ({
				username: row.username,
				bestScore: row.best_score,
			}))
		} catch (error) {
			console.log('Could not retrieve best scores:', error)
			throw error
		}
	}
}

module.exports.Utils = Utils
