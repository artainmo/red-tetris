class Player {
	#username
	#game_id
	#score
	#socket
	#hasLost

	constructor(username, game_id, score = 0, socket = null) {
		this.#username = username
		this.#game_id = game_id
		this.#score = score
		this.#socket = socket
		this.#hasLost = false
	}

	get username() {
		return this.#username
	}

	get game_id() {
		return this.#game_id
	}

	get score() {
		return this.#score
	}

	set score(newScore) {
		this.#score = newScore
	}

	get socket() {
		return this.#socket
	}
	set socket(newSocket) {
		this.#socket = newSocket
	}

	toJSON() {
		return {
			username: this.#username,
			game_id: this.#game_id,
			score: this.#score,
		}
	}

	async setDB(db) {
		//'ON CONFLICT DO UPDATE' makes this idempotent: 'Game.setDB' can now be called several times over
		//a room's life (whenever a round ends or a player leaves, not just once the room is fully empty -
		//see 'app.js'), and each call just syncs this player's latest score into their one row for this
		//room instead of failing on the '(username, game_id)' primary key.
		await db.query(
			`INSERT INTO player (username, game_id, score) VALUES ($1, $2, $3)
			ON CONFLICT (username, game_id) DO UPDATE SET score = EXCLUDED.score
			RETURNING *`,
			[this.#username, this.#game_id, this.#score]
		)
		return this
	}

	get hasLost() {
		return this.#hasLost
	}

	set hasLost(value) {
		this.#hasLost = value
	}
}

module.exports = { Player }
