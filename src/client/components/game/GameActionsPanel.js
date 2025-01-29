import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, endGame, resumeGame, pauseGame } from "../../redux/slices/gameTimeSlice";
import { inlineContainerStyle } from "../../style/containersStyle";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { middlePanelStyle } from "../../style/panelStyle";

const GameActionsPanel = ({isMultiPlayer}) => {

	const dispatch = useDispatch();
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused);
	const isGameStarted = useSelector((state) => state.gameTime > 0);

	const pieceContainerStyle = {
		width: '400px',
		height: '400px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'start',
		margin: '3.5rem'
	}

	const pieceSquare = {
		width: '50%',
		height: '50%',
		border: '1rem solid white',
	}

	const alignSelfEnd = {
		alignSelf: 'flex-end',
		marginBottom: '1rem'
	}

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
		<div style={middlePanelStyle}>
			<div style={pieceContainerStyle}>
				<div style={pieceSquare}>
					{/* add logic to add piece */}
				</div>
			</div>
			{
				isMultiPlayer && <div></div>
			}
			<div style={inlineContainerStyle}>
				<div style={alignSelfEnd}>
				{
					isGameStarted ?
					<RedButton 
						textContent={isGamePaused ? "Resume" : "Pause"}
						onClick={handleClickPauseResumeButton}/>
					:
					<RedButton 
						textContent="Start"
						onClick={handleClickStartButton}/>
				}
				</div>
				<div style={alignSelfEnd}>
					<YellowButton
						textContent="Cancel"
						onClick={handleClickCancelButton}/>
				</div>
			</div>
		</div>
	);
}

export default GameActionsPanel;
