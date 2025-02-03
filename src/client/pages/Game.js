import React from "react";
import { useSelector } from "react-redux";
import { pageMainContainerStyle } from "../style/containersStyle";
import Board from "../components/game/Board";
import GameStatsPanel from "../components/game/GameStatsPanel";
import { setIsGameOver } from "../redux/slices/gameplaySlice";
import { panelsStyle } from "../style/panelStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";
import GameEnd from "./GameEnd";

const Game = () => {
	
	const isGameOver = useSelector((state) => state.gameplay.setIsGameOver)
	const score = useSelector((state) => state.currentGame.score)

	return (
			isGameOver ?
			<GameEnd wonOrLostText={"Game is up! Your score is " + {score}}/>
			:
			<div style={pageMainContainerStyle}>		
				<RedTetrisLogo firstLine={"Red"} secondLine={"Tetris"}/>	
				<div style={panelsStyle}>
					<GameStatsPanel />							{/* Left panel */}
					<Board isMultiPlayer={false}/>				{/* Center and right panel */}
				</div>
			</div>
	)
}

export default Game;
