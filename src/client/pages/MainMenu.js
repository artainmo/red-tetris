import React from "react";
import LeftMenuPannel from "../components/main-menu/LeftMenuPannel";
import RightMenuPannel from "../components/main-menu/RightMenuPannel";
import { whiteStyle, redStyle, pageMainContainerStyle, startButtonContainerStyle } from "../style/pagesStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";

const MainMenu = () => {
	
	const pannelsStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		margin: 0
	}
	
	return (
		<div style={pageMainContainerStyle}>
			<RedTetrisLogo/>
				<div style={pannelsStyle}>
					<LeftMenuPannel />
					<RightMenuPannel />
				</div>
		</div>
	)
}

export default MainMenu;
