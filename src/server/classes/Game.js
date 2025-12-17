const { Player } = require('./Player')
const { Piece } = require('./Piece')
const MAX_PLAYERS = 4

class Game {
	#id
	#locked
	#finished
	#host
	#players
	#historicalPlayers
	#piece

	constructor(_id = null, _locked = false, _finished = false, _host = null) {
		this.#id = _id
		this.#locked = _locked
		this.#finished = _finished
		this.#host = _host
		this.#players = []
		this.#historicalPlayers = []
		this.#piece = new Piece()
	}

	get piece() {
		return this.#piece
	}

	set piece(value) {
		this.#piece = value
	}

	get socket() {
		const socketList = []
		for (const player of this.#players) {
			socketList.push(player.socket)
		}
		return socketList
	}

	display() {
		const text = `Game ID: ${this.#id}, Locked: ${this.#locked}, Finished: ${this.#finished}, Host: ${this.#host}, Players: ${this.#players}`
		console.log(text)
		return text
	}

	async setDB(db) {
		await db.query(
			'INSERT INTO game (id, locked, finished, host) VALUES ($1, $2, $3, $4) RETURNING *',
			[this.#id, this.#locked, this.#finished, this.#host]
		)
		for (const player of this.#historicalPlayers) {
			await player.setDB(db)
		}
		console.log(`Game ${this.#id} created in database.`)
		return this
	}

	toJSON() {
		const players = this.#players.map((player) => player.toJSON())
		return {
			id: this.#id,
			locked: this.#locked,
			finished: this.#finished,
			host: this.#host,
			pieceBasket: this.#piece.toJSON().pieceBasket,
			players: players,
		}
	}

	lockGame() {
		this.#locked = true
		console.log(`Game ${this.#id} is now locked.`)
		return this
	}

	addPlayer(username, socket = null) {
		if (this.#players.length >= MAX_PLAYERS) {
			console.log('Cannot add more players to this game')
			return false
		}
		if (this.#locked) {
			console.log('Cannot add players to a locked game')
			return false
		}
		for (const player of this.#players) {
			if (player.username === username) {
				console.log('Player already in this game')
				return false
			}
		}
		const newPlayer = new Player(username, this.#id, 0, socket)
		this.#players.push(newPlayer)
		this.#historicalPlayers.push(newPlayer)
		return this
	}

	removePlayer(username) {
		console.log(`Players length before removal: ${this.#players.length}`)
		for (const player of this.#players) {
			console.log(`Player in game: ${player.username}`)
		}
		const index = this.#players.findIndex(
			(player) => player.username === username
		)
		if (index === -1) {
			console.log('Player not found in this game')
			return false
		}
		this.#players.splice(index, 1)
		console.log(`Players length after removal: ${this.#players.length}`)
		if (this.#host === username) {
			console.log('Host has left the game')
			if (this.#players.length > 0) {
				console.log('Setting new host')
				this.#host = this.#players[0].username
			} else {
				this.#finished = true
			}
		}
		return this
	}

	playerLoosed(username) {
		const index = this.#players.findIndex(
			(player) => player.username === username
		)
		if (index === -1) {
			console.log('Player not found in this game')
			return false
		}
		this.#players[index].hasLost = true
		return this
	}

	allPlayersLoosed() {
		for (const player of this.#players) {
			if (!player.hasLost) {
				return false
			}
		}
		return true
	}

	async endGame(db) {
		this.#finished = true
		console.log(`Game ${this.#id} ended.`)
		await this.setDB(db)
		return this
	}

	set id(value) {
		this.#id = value
	}

	get id() {
		return this.#id
	}

	get locked() {
		return this.#locked
	}

	set locked(value) {
		this.#locked = value
	}

	get finished() {
		return this.#finished
	}

	set finished(value) {
		this.#finished = value
	}

	get host() {
		return this.#host
	}

	set host(value) {
		this.#host = value
	}

	get players() {
		return this.#players
	}

	set players(value) {
		this.#players = value
	}
}

module.exports.Game = Game
