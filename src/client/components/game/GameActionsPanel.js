import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, endGame, resumeGame, pauseGame } from "../../redux/slices/gameTimeSlice";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";

const GameActionsPanel = () => {

	const dispatch = useDispatch();
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused);
	const isGameStarted = useSelector((state) => state.gameTime > 0);

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

	return (
		<div>
			{
				isGameStarted ?
				<RedButton 
					textContent={isGamePaused ? "Resume" : "Pause"}
					onClick={handleClickPauseResumeButton}/>
				:
				<RedButton 
					textContent="Start Game"
					onClick={handleClickStartButton}/>
			}
			<YellowButton
				textContent="Cancel Game"
				onClick={handleClickCancelButton}/>
		</div>
	);
}

export default GameActionsPanel;
