const ALL_PIECES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']

class Piece {
	#pieceBasket

	constructor() {
		this.#pieceBasket = []
		this.generatePieceBasket()
	}

	displayPiece() {
		console.log(`type = ${this._type}`)
	}

	get pieceBasket() {
		return this.#pieceBasket
	}

	set pieceBasket(value) {
		this.#pieceBasket = value
	}

	generatePieceBasket() {
		const shuffledPieces = ALL_PIECES.map((value) => ({
			value,
			sort: Math.random(),
		}))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value)

		this.#pieceBasket = this.#pieceBasket.concat(shuffledPieces)
		return shuffledPieces
	}

	toJSON() {
		return {
			pieceBasket: this.#pieceBasket,
		}
	}
}

module.exports.Piece = Piece
