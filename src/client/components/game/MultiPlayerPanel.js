import React from "react";
import { useState } from "react";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { multiplayerStatsContainerStyle, wrapFlexContainerStyle, smallWhiteStyle } from "../../style/containersStyle";
import PlayerCard from "./PlayerCard";

const MultiPlayerPanel = () => {

	const gameTime = useState('0:0') // useSelector((state) => state.gameTimeSlice.updateGameTime);
	// const players = [
	// 	{ username: "Player 1"},
	// 	{ username: "Player 2"},
	// 	{ username: "Player 3"},
	// 	{ username: "Player 4"},
	// ]

	return (
		<div style={fullTransparentMenuPanelStyle}>
			<div style={multiplayerStatsContainerStyle}>
					<p style={smallWhiteStyle}>
						GAME DURATION
					</p>
					<p style={smallWhiteStyle}>
						{gameTime}
					</p>
				</div>
				<div style={wrapFlexContainerStyle}>
					<PlayerCard username="Player 1"/>
					<PlayerCard username="Player 2"/>
				</div>
				<div style={wrapFlexContainerStyle}>
					<PlayerCard username="Player 3"/>
					<PlayerCard username="Player 4"/>
				</div>
		</div>
	);
}

export default MultiPlayerPanel;
