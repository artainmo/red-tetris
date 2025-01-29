import React from "react";
import BestScoresArray from "./BestScoresArray";
import { fullWhiteMenuPanelStyle } from "../../style/panelStyle";


const RightMenuPanel = () => {
	
	return (
		<div style={fullWhiteMenuPanelStyle}>
			<BestScoresArray />
		</div>
	);

}

export default RightMenuPanel;
