import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleDivStyle, titleStyle, delimiterStyle, arrayDisplayDivStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";
import Button from "../shared/RedButton";

const RoomsArray = () => {
	
	const rooms = useSelector((state) => Object.values(state.currentGame.scores))

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div style={titleDivStyle}>
					<h2 style={titleStyle}>Active Rooms</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div style={arrayDisplayDivStyle}>
				{
					rooms.map((item, index) => (
							<span>
								<p key={index}>{item}</p>
								<Button>Join</Button>
							</span>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default RoomsArray;
