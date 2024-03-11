import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGrid } from "../logic/grid.logic";

const NextPiece = () => {
	
	const dispatch = useDispatch();
	// const { currentSession } = useSelector((state) => state.gameSessions); // update this
	// const { nextPiece, status } = useSelector((state) => state.piece); // update this 
	
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
			
		</div>
	);
}

export default NextPiece;
