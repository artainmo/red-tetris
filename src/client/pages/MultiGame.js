import React from "react";
import { useSelector } from "react-redux";
import { pageMainContainerStyle } from "../style/containersStyle";
import Board from "../components/game/Board";
import MultiPlayerPanel from "../components/game/MultiPlayerPanel";
import { panelsStyle } from "../style/panelStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";
import GameEnd from "./GameEnd";
import Lobby from "./Lobby";

const MultiGame = () => {

	const isGameOver = useSelector((state) => state.gameplay.isGameOver)
	const waitingForPlayersToJoin = useSelector((state) => state.currentGame.waitingForPlayersToJoin)
	const score = useSelector((state) => state.gameplay.score)

	return (
			(waitingForPlayersToJoin) ? <Lobby/>
			:
			(isGameOver) ? <GameEnd firstLine="Game is up!" secondLine={"Your score is " + score}/>
			:
			<div style={pageMainContainerStyle}>		
				<RedTetrisLogo firstLine="Red" secondLine="Tetris"/>	
				<div style={panelsStyle}>
					<MultiPlayerPanel />						{/* Left panel */}
					<Board isMultiPlayer={true} />				{/* Center and right panel */}
				</div>
			</div>
	)
}

export default MultiGame;
