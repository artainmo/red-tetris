
//hook to create a bag of random pieces. To be replace when integrating to the main project 
//!This code has also been put in the backend!


import { useState } from "react";

const usePieceGenerator = () => {
	
	const shuffleArrayWithFisherYatesPermutationAlgo = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			// random number from 0 to i (included)
			let j = Math.floor(Math.random() * (i + 1));
			// swap i index to the randomly chosen j index
			[arr[i], arr[j]] = [arr[j], arr[i]] ;
		}
		return arr;
	}

	const PIECES_TYPE = ["I", "O", "T", "L", "J", "S", "Z"];
	const [ bag, setBag ] = useState(shuffleArrayWithFisherYatesPermutationAlgo([...PIECES_TYPE]));
	const [ piece, setPiece ] = useState("")
	const [ nextPiece, setNextPiece ] = useState("")

	const getNextPiece = () => {

		if (bag.length === 1) {
			setPiece(bag[0]);
			setBag(shuffleArrayWithFisherYatesPermutationAlgo([...PIECES_TYPE]));
			setNextPiece(bag[1]);
			setBag((prevBag) => prevBag.slice(1)); 
		}
		else
		{
			setPiece(bag[0]);
			setNextPiece(bag[1]);
			setBag((prevBag) => prevBag.slice(2));
		}
		console.log(piece)
		console.log(nextPiece)
		return [piece, nextPiece];
	};

	return getNextPiece;
};

export default usePieceGenerator;

