import React, {useState, useEffect} from "react";
import { sendPlayerInput } from "../api/socket.api";
import Cell from "./Cell";

const GRID_LENGTH = 20;
const GRID_WIDTH = 10;

const TetrisBoard = () => {

	/* creates a 2 dimension array of Cell components that compose the board */
	const initBoard = () => {
		const board = [];
		for (let y = 0; y < GRID_LENGTH; y++) {
			const row = [];
			for (let x = 0; x < GRID_WIDTH; x++) {
				row.push(<Cell key={`${x}-${y}`} cellColor={null} />);
			}
			board.push(<div key={y} style={{display: 'flex'}}>{row}</div>);
		}
		return board;
	}

	const [board, setBoard] = useState(initBoard());

	/* connect to socket when starting the game */
	useEffect(() => {
		
	}, []);

	/* handling the player input with WASD keys of the keyboard */
	useEffect(() => {
		const handleKeyDown = (event) => {
			switch (event.key) {
				case 'w':
					// sendPlayerInput();
					break;
				case 'a':
					// sendPlayerInput();
					break;
				case 's':
					// sendPlayerInput();
					break;
				case 'd':
					// sendPlayerInput();
					break;
				default:
					console.log('unrecognized key');
					break;
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		console.log('WASD keydown');
		/* suppress event to avoid leaks */
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, []);

	const boardStyle = {
		backgroundColor: 'black'
	}
	
	return (
		<div style={boardStyle}>
			{board}
		</div>
	);
}

export default TetrisBoard;
