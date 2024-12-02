import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, endGame, resumeGame, pauseGame } from "../../redux/slices/gameTimeSlice";

const GameActionsPannel = () => {

	const dispatch = useDispatch();
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused);

	const handleClickStartButton = () => {
		console.log('should start the game');
		dispatch(startGame());
	}

	const handleClickPauseResumeButton = () => {
		console.log('should pause the game');
		if (!isGamePaused) {
			dispatch(pauseGame());
		} else {
			dispatch(resumeGame());
		}
	}

	const handleClickCancelButton = () => {
		console.log('should cancel the game');
		dispatch(endGame());
	}

	const gameActionPannelContainerStyle = {

	}

	const gameActionPannelButtonStyle = {

	}

	return (
		<div style={gameActionPannelContainerStyle}>
			<button 
				style={gameActionPannelButtonStyle}
				onClick={handleClickStartButton}>
					Start Game
			</button>
			<button 
				style={gameActionPannelButtonStyle}
				onClick={handleClickPauseResumeButton}>
					{isGamePaused ? 'Resume Game' : 'Pause Game'}
			</button>
			<button
				style={gameActionPannelButtonStyle}
				onClick={handleClickCancelButton}>
					Cancel Game
			</button>
		</div>
	);
}

export default GameActionsPannel;
