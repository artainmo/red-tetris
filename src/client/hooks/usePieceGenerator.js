
//hook to create a bag of random pieces. To be replace when integrating to the main project 
//!This code has also been put in the backend!


import { useEffect, useState } from "react";

const usePieceGenerator = () => {
	
	const [ bag, setBag ] = useState([]);
	const [ piece, setPiece ] = useState("")
	const [ nextPiece, setNextPiece ] = useState("")

	const PIECES_TYPE = ["I", "O", "T", "L", "J", "S", "Z"];
	const shuffleArrayWithFisherYatesPermutationAlgo = (arr) => {
		for (let i = arr.length - 1; i > 0; i--) {
			// random number from 0 to i (included)
			let j = Math.floor(Math.random() * (i + 1));
			// swap i index to the randomly chosen j index
			[arr[i], arr[j]] = [arr[j], arr[i]] ;
		}
		setBag([...arr]);
		const piece = bag.pop();
		const nextPiece = bag.pop();
		return {piece, nextPiece}
	}

	const getNextPiece = () => {
		return shuffleArrayWithFisherYatesPermutationAlgo(PIECES_TYPE);
	}

	// useEffect(() => {
	// 	if (piece == undefined || nextPiece == undefined)
	// 		getNextPiece;
	// }, [piece, nextPiece]);


	return getNextPiece;
};

export default usePieceGenerator;

