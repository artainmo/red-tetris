import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
//import { useSelector } from "react-redux";
import Button from "../shared/RedButton";

const RoomsArray = () => {
	
	const rooms = [] // useSelector((state) => Object.values(state.currentGame.players))

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Active Rooms</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
				{
					rooms.map((item, index) => (
							<span key={index}>
								<p>{item}</p>
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
