import React from "react";
import { useState } from "react";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { multiplayerStatsContainerStyle, wrapFlexContainerStyle, smallWhiteStyle } from "../../style/containersStyle";
import PlayerCard from "./PlayerCard";
import { useSelector } from "react-redux";

const MultiPlayerPanel = () => {

	const gameTime = useSelector((state) => state.gameTime.gameTime);
	const players =  useSelector((state) => state.currentGame.players);
	const game =  useSelector((state) => state.currentGame);

	console.log("current game")
	console.log(game)
	console.log(players)

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
					<PlayerCard username={players[0].username}/>
					<PlayerCard username={players[1].username}/>
				</div>
				<div style={wrapFlexContainerStyle}>
				{
					players[2] != null && <PlayerCard username={players[2].username}/>
				}
				{
					players[3] != null && <PlayerCard username={players[3].username}/>
				}
				</div>
		</div>
	);
}

export default MultiPlayerPanel;
