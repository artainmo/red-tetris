import React from "react";
import BestScoresArray from "./BestScoresArray";
import { mainMenuPannelStyle } from "../../style/menuStyle";


const RightMenuPanel = () => {
	
	return (
		<div style={mainMenuPannelStyle}>
			<BestScoresArray />
		</div>
	);

}

export default RightMenuPanel;
