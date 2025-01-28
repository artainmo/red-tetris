import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";

const ScoresArray = () => {
	
	const scores = useSelector((state) => Object.values(state.currentGame.scores))

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Your Scores</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
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
