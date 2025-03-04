/*
** A piece basket hold 7 pieces that represents every type of tetromino.
** Players will receive one random piece of the basket until it empties and has to be refilled.
*/

class PieceBasket {

	constructor() {
		this.bag = [];
		this.PIECES_TYPE = ["I", "O", "T", "L", "J", "S", "Z"];
	}

	shuffleArrayWithFisherYatesPermutationAlgo = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			/* random number from 0 to i (included) */
			let j = Math.floor(Math.random() * (i + 1));
			/* swap i index to the randomly chosen j index */
			[arr[i], arr[j]] = [arr[j], arr[i]] ;
		}
		return arr;
	}

	getNextPiece = () => {
		if (this.bag.length === 0) {
			const newBag = this.shuffleArrayWithFisherYatesPermutationAlgo([...this.PIECES_TYPE]);
			this.bag = newBag.slice(1); 
			// console.log(newBag[0]);
			return newBag[0]; 
		}
		const nextPiece = this.bag[0];
		this.bag = this.bag.slice(1);
		// console.log(nextPiece);
		return nextPiece;
	};
}

module.exports.PieceBasket = PieceBasket;
