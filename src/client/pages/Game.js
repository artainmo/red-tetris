import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { pageMainContainerStyle } from "../style/containersStyle";
import Board from "../components/game/Board";
import GameStatsPanel from "../components/game/GameStatsPanel";
import { panelsStyle } from "../style/panelStyle";
import { setIsGameOver } from "../redux/slices/gameplaySlice";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";
import GameEnd from "./GameEnd";

const Game = () => {
	
	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	const score = useSelector((state) => state.gameplay.score)

	return (
			isGameOver ?
			<GameEnd firstLine="Game is up!" secondLine={"Your score is " + score}/>
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
