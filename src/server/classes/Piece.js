/*
	Piece is used to generate a random piece to the board game every time it is necessary

	Letters are used to indicate every type of tetromino that are used by the original tetris game.
	Check at this website : https://tetris.fandom.com/wiki/Tetromino#I for more detailled information
*/

const ALL_PIECES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

class Piece {
	#pieceBasket;

	constructor() {
    	this.#pieceBasket = [];
		this.generatePieceBasket();
	}

	displayPiece() {
		console.log(`type = ${this._type}`);
	}

	get pieceBasket() {
		return this.#pieceBasket;
	}

	set pieceBasket(value) {
		this.#pieceBasket = value;
	}

	generatePieceBasket() {
		const shuffledPieces = ALL_PIECES
			.map(value => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
		
		this.#pieceBasket = this.#pieceBasket.concat(shuffledPieces);
		return shuffledPieces;
	}

	toJSON() {
		return {
			pieceBasket: this.#pieceBasket
		};
	}

	async setDB(db, gameId) {
		await db.query("UPDATE game SET piece_basket = $1 WHERE id = $2 RETURNING *",
			[this.#pieceBasket, gameId]);
		return this;
	}
}

module.exports.Piece = Piece;
