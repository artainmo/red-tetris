import React from "react";
import { useSelector } from "react-redux";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { statsContainerStyle, stackedContainerStyle, smallWhiteStyle } from "../../style/containersStyle";

const GameStatsPanel = () => {

	const gameTime = useSelector((state) => state.gameTime.currentTime);
	const gameScore = useSelector((state) => state.gameplay.score);

	const formatTime = (milliseconds) => {
		const minutes = Math.floor(milliseconds / (60 * 1000));
		const seconds = ((milliseconds % (60 * 1000)) / 1000).toFixed(0);
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<div style={fullTransparentMenuPanelStyle}>
			<div style={statsContainerStyle}>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME STATS</p>
				</div>
				<div style={stackedContainerStyle}>
					<p style={smallWhiteStyle}>GAME DURATION</p>
					<p style={smallWhiteStyle}>{formatTime(gameTime)}</p>
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
