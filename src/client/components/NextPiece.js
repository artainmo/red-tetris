import React, { useEffect } from "react";
import { createGrid } from "../logic/board.logic";

const NextPiece = () => {
	
	/* at setup, retrieve the grid for a piece */
	useEffect(() => {
		
	}, []);
	
	const nextPieceStyle = {
		backgroundColor: 'red',
		width: '100%',
		height: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
	
	return (
		<div style={nextPieceStyle}>
			add the nextPiece elem there
		</div>
	);
}

export default NextPiece;
