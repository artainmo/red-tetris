import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";

const BestScoresArray = () => {
	
	const scores = useSelector((state) => Object.values(state.currentGame.scores))
	console.log("scores here")
	console.log(scores)
	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Best Scores</h2>
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

export default BestScoresArray;
