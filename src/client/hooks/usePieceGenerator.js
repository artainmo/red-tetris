/* 
//hook to create a bag of random pieces. To be replace when integrating to the main project 

import { useState } from "react";

const usePieceGenerator = () => {
	
	const PIECES_TYPE = ["I", "O", "T", "L", "J", "S", "Z"];
	const [ bag, setBag ] = useState([]);

	const shuffleArrayWithFisherYatesPermutationAlgo = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			// random number from 0 to i (included)
			let j = Math.floor(Math.random() * (i + 1));
			// swap i index to the randomly chosen j index
			[arr[i], arr[j]] = [arr[j], arr[i]] ;
		}
		return arr;
	}

	const getNextPiece = () => {
		if (bag.length === 0) {
			const newBag = shuffleArrayWithFisherYatesPermutationAlgo([...PIECES_TYPE]);
			setBag(newBag.slice(1)); 
			console.log(newBag[0]);
			return newBag[0]; 
		}

		const nextPiece = bag[0];
		console.log(nextPiece);
		setBag((prevBag) => prevBag.slice(1));
		return nextPiece;
	};

	return getNextPiece;
};

export default usePieceGenerator;
*/
