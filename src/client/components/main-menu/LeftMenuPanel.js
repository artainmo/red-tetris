import React from "react"
import ScoresArray from "./ScoresArray";
import { mainMenuPannelStyle } from "../../style/menuStyle";

const LeftMenuPanel = () => {

	return (
		<div style={mainMenuPannelStyle}>
			<ScoresArray />
		</div>
	)

};

export default LeftMenuPanel;
