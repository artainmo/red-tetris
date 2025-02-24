import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startGame, endGame, resumeGame, pauseGame } from "../../redux/slices/gameTimeSlice";
import { inlineContainerStyle, smallWhiteStyle, statsContainerStyle, stackedContainerStyle, wrapFlexContainerStyle, titleContainerStyle } from "../../style/containersStyle";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { middlePanelStyle } from "../../style/panelStyle";
import useManageTime from "../../hooks/useManageTime";

const GameActionsPanel = ({isMultiPlayer}) => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused);
	const isGameStarted = useSelector((state) => state.gameTime > 0);
	const nextPiece = useSelector((state) => state.piece.nextActivePiece);
	const gameRank = useSelector((state) => state.gameplay.rank);
	const gameScore = useSelector((state) => state.gameplay.score);

	useManageTime();

	const pieceContainerStyle = {
		width: '100%',
		height: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'start',
		margin: 0
	}

	const pieceSquare = {
		width: '200px',
		height: '200px',
		border: '1rem solid white',
		marginTop: 0,
		margin: '3rem'
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
		navigate('/main_menu');
	}

	return (
		<div style={middlePanelStyle}>
			<div style={pieceContainerStyle}>
				<div style={pieceSquare}>
					{nextPiece}
				</div>
			</div>
				<div style={stackedContainerStyle}>
				{
					isMultiPlayer && 
					<>
						<div style={titleContainerStyle}>
							<h3 style={smallWhiteStyle}>GAME STATS</h3>
						</div>
						<div style={wrapFlexContainerStyle}>
							<div style={statsContainerStyle}>
								<h5 style={smallWhiteStyle}>SCORE</h5>
								<p style={smallWhiteStyle}>{gameScore}</p>
							</div>
							<div style={statsContainerStyle}>
								<h5 style={smallWhiteStyle}>RANK</h5>
								<p style={smallWhiteStyle}>{gameRank}</p>
							</div>
						</div>
					</>
				}
				</div>
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
