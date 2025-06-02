import React, { useState, useEffect } from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";
import { getGames } from "../../api/http.api";

const ScoresArray = ({user, scores}) => {

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Your Scores</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
				{
					scores.map((score, index) => (
							<p key={index}>{user} got {score} points</p>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default ScoresArray;
