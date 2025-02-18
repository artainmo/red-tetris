import React from "react";
import { useState } from "react";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { multiplayerStatsContainerStyle, wrapFlexContainerStyle, smallWhiteStyle } from "../../style/containersStyle";
import PlayerCard from "./PlayerCard";
import { useSelector } from "react-redux";

const MultiPlayerPanel = () => {

	const gameTime = useSelector((state) => state.gameTime.gameTime);
	const players =  useSelector((state) => state.gameplay.players);

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
