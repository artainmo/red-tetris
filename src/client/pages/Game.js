import React from "react";
import { pageMainContainerStyle } from "../style/pagesStyle";
import Board from "../components/game/Board";
import GameStatsPanel from "../components/game/GameStatsPanel";
import { panelsStyle } from "../style/panelStyle";

const Game = () => {
	
	return (
		<div style={pageMainContainerStyle}>			
			<div style={panelsStyle}>
				<GameStatsPanel />		{/* Left panel */}
				<Board />				{/* Center and right panel */}
			</div>
		</div>
	)
}

export default Game;
