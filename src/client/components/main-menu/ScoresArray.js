import React from "react";
import { mainContainerStyle, arrayDivStyle, titleDivStyle, titleStyle, delimiterStyle, arrayDisplayDivStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";

const ScoresArray = () => {
	
	const scores = useSelector((state) => Object.values(state.currentGame.scores))

	return (
		<div style={mainContainerStyle}>
			<div style={arrayDivStyle}>
				<div style={titleDivStyle}>
					<h2 style={titleStyle}>Your Scores</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div style={arrayDisplayDivStyle}>
				{
					scores.map((item, index) => (
							<p key={index}>{item}</p>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default ScoresArray;
