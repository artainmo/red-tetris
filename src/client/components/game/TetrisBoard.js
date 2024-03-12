/**/

import React, {useState, useEffect} from "react";
import { gridToBoard } from "../../logic/board.logic";
import { createGrid } from "../../logic/grid.logic";
import useLockDelay from "../../logic/hooks/useLockDelay";
import useGravity from "../../logic/hooks/useGravity";
import { processLockDelay } from "../../logic/lockDelay.logic";
import { processGravity } from "../../logic/gravity.logic";
import { processPlayerInput } from "../../logic/playerInputs.logic";
import Cell from "./Cell";
import { useSelector } from "react-redux";

const GRAVITY_INTERVAL = 500;
const LOCK_DELAY = 500;
const GRID_LENGTH = 20;
const GRID_WIDTH = 10;

const TetrisBoard = () => {

	/* creates an empty grid, then convert it to board */
	const [grid, setGrid] = useState(createGrid(GRID_WIDTH, GRID_LENGTH));
	const [board, setBoard] = useState(gridToBoard(grid, GRID_WIDTH, GRID_LENGTH));

	/* custom hooks for gravity and lock delay */
	const { start: startGravity, stop: stopGravity, 
		reset: resetGravity, resume: resumeGravity } = useGravity(processGravity, GRAVITY_INTERVAL);
	const { start: startLockDelay, reset: resetLockDelay, clear: clearLockDelay,
		pause: pauseLockDelay, resume: resumeLockDelay} = useLockDelay(processLockDelay, LOCK_DELAY);

	/* checks whether the game is active or not */
	const { isGameActive, isGamePaused } =  useSelector((state) => state.gameTime);

	/* connect to socket when starting the game */
	useEffect(() => {
		// TODO
	}, []);

	/* react when game started or ended */
	useEffect(() => {
		if (isGameActive) {
			startGravity();
		} else {
			stopGravity();
		}
	}, [isGameActive, startGravity, stopGravity]);

	/* react when game is paused or resumed */
	useEffect(() => {
		if (isGamePaused) {
			stopGravity();
			pauseLockDelay();
		} else if (isGameActive) {
			resumeGravity();
			resumeLockDelay();
		}
	}, [isGamePaused, isGameActive, stopGravity, resumeGravity, pauseLockDelay, resumeLockDelay]);

	/* everytime the grid is updated (gravity, player input), rerendering happens */
	useEffect(() => {
		setBoard(gridToBoard(grid));
	}, [grid]);

	/* handling the player input with WASD keys of the keyboard */
	useEffect(() => {
		if (!isGameActive || isGamePaused) {
			return;
		}

		const handleKeyDown = (event) => {
			let inputType;
			switch (event.key) {
				case 'w':
					inputType = 'up';
					break;
				case 'a':
					inputType = 'left';
					break;
				case 's':
					inputType = 'down';
					break;
				case 'd':
					inputType = 'up';
					break;
				default:
					console.log('unrecognized key'); // update that
					break;
			}
			const updatedGrid = processPlayerInput(inputType, grid);
			setGrid(updatedGrid);
		}

		window.addEventListener('keydown', handleKeyDown);
		console.log('WASD keydown');
		/* suppress event to avoid leaks */
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		}
	}, [isGameActive, isGamePaused]);

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
