import React from "react";
import { useState } from "react";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { statsContainerStyle, stackedContainerStyle, smallWhiteStyle } from "../../style/containersStyle";

const GameStatsPanel = () => {

	const gameTime = useState('0:0') // useSelector((state) => state.gameTimeSlice.updateGameTime);
	const gameScore = useState('0') // useSelector((state) => state.gameplaySlice.setScore);

	return (
		<div style={fullTransparentMenuPanelStyle}>
			<div style={statsContainerStyle}>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME STATS</p>
				</div>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME DURATION</p>
					<p style={smallWhiteStyle}>{gameTime}</p>
				</div>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>SCORE</p>
					<p style={smallWhiteStyle}>{gameScore}</p>
				</div>
			</div>
		</div>
	);
}

export default GameStatsPanel;
