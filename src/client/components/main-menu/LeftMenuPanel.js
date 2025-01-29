import React from "react"
import ScoresArray from "./ScoresArray";
import { fullWhiteMenuPanelStyle } from "../../style/panelStyle";

const LeftMenuPanel = () => {

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<ScoresArray />
		</div>
	)

};

export default LeftMenuPanel;
