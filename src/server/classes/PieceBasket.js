const { Piece } = require("./Piece");

/*
** A piece basket hold 7 pieces that represents every type of tetromino.
** Players will receive one random piece of the basket until it empties and has to be refilled.
*/

class PieceBasket {

	constructor() {
		this.pieces = [];
		this.fullfillPieceBasket();
	}

	fullfillPieceBasket() {
		const pieceTypeArray = ["I", "O", "T", "S", "Z", "J", "L"];

		if (this.pieces.length === 0) {
			for (let i = 0; i < pieceTypeArray.length; i++) {
				this.addPieceToBasket(pieceTypeArray[i]);
			}
		}
	}

	addPieceToBasket(type) {
		const newPiece = new Piece(type);
		this.pieces.push(newPiece);
	}

	removePieceInPieceBasket(index) {
		if (index >= 0 && index < this.pieces.length) {
			this.pieces.splice(index, 1);
		}
	}

	pickPieceInPieceBasket() {
		if (this.pieces.length === 0) {
			this.fullfillPieceBasket();
		}

		const randomPieceIndex = this.getRandomIntInclusive(0, this.pieces.length - 1);
		console.log(`randomPieceIndex = ${randomPieceIndex}`); // debug

		const pickedPiece = this.pieces[randomPieceIndex];
		this.removePieceInPieceBasket(randomPieceIndex);

		return pickedPiece;
	}

	getRandomIntInclusive(min, max) {
		const minCeiled = Math.ceil(min);
		const maxFloored = Math.floor(max);
		return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
	}
}

module.exports.PieceBasket = PieceBasket;
