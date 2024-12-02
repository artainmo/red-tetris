import React from "react";
import LeftMenuPannel from "../components/main-menu/LeftMenuPannel";
import RightMenuPannel from "../components/main-menu/RightMenuPannel";
import { mainContainerStyle, landingPageStyle } from '../style/mainStyle';

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
		<div style={mainContainerStyle}>
			<div style={landingPageStyle}>
				<div style={pannelsStyle}>
					<LeftMenuPannel />
					<RightMenuPannel />
				</div>
			</div>
		</div>
	)
}

export default MainMenu;
