import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startGame, endGame, resumeGame, pauseGame } from "../../redux/slices/gameTimeSlice";
import { resetGame } from "../../redux/slices/currentGameSlice";
import { resetGameplay } from "../../redux/slices/gameplaySlice";
import { inlineContainerStyle, smallWhiteStyle, statsContainerStyle, stackedContainerStyle, wrapFlexContainerStyle, titleContainerStyle } from "../../style/containersStyle";
import Cell from "./Cell";
import RedButton from "../shared/RedButton";
import YellowButton from "../shared/YellowButton";
import { middlePanelStyle } from "../../style/panelStyle";
import useManageTime from "../../hooks/useManageTime";

const GameActionsPanel = ({isMultiPlayer}) => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isGamePaused = useSelector((state) => state.gameTime.isGamePaused);
	const isGameStarted = useSelector((state) => state.gameTime.isGameActive);
	const box = useSelector((state) => state.gameplay.box)
	const gameRank = useSelector((state) => state.gameplay.rank);
	const gameScore = useSelector((state) => state.gameplay.score);

	useManageTime();

	/* dimensions of the board, in numbers of cells */
	const BOX_WIDTH = 10;
	const BOX_HEIGHT = 10;
	/* dimensions of an individual cell */
	const CELL_WIDTH = 30;
	const CELL_HEIGHT = 30;
	/* dimensions of the BOX, in pixels */
	const BOX_WIDTH_PIXELS = BOX_WIDTH * CELL_WIDTH;
	const BOX_HEIGHT_PIXELS = BOX_HEIGHT * CELL_HEIGHT;

	const pieceContainerStyle = {
		width: '100%',
		height: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'start',
		margin: 0
	}

	const pieceSquare = {
		width: BOX_WIDTH_PIXELS,
		height: BOX_HEIGHT_PIXELS,
		display: 'grid',
		gridTemplateRows: `repeat(${BOX_HEIGHT}, 1fr)`,
		gridTemplateColumns: `repeat(${BOX_WIDTH}, 1fr)`,
		boxSizing: 'border-box',
		border: '1rem solid white'
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
		dispatch(resetGame());
		dispatch(resetGameplay());
		navigate('/main_menu');
	}

	return (
		<div style={middlePanelStyle}>
			<div style={pieceContainerStyle}>
				<div style={pieceSquare}>
					{
						box.map((row, rowIndex) =>
							row.map((cell, cellIndex) => (
								<Cell key={`${rowIndex}-${cellIndex}`} colorCode={cell} />
							))
						)
					}
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
