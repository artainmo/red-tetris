import React from "react";
import { pageMainContainerStyle } from "../style/containersStyle";
import Board from "../components/game/Board";
import GameStatsPanel from "../components/game/GameStatsPanel";
import { panelsStyle } from "../style/panelStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";

const Game = () => {
	
	return (
		<div style={pageMainContainerStyle}>		
			<RedTetrisLogo firstLine="Red" secondLine="Tetris"/>	
			<div style={panelsStyle}>
				<GameStatsPanel />		{/* Left panel */}
				<Board />				{/* Center and right panel */}
			</div>
		</div>
	)
}

export default Game;
