import React from "react";
import Header from "../components/Header";
import LeftMenuPannel from "../components/LeftMenuPannel";
import RightMenuPannel from "../components/RightMenuPannel";
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
			<Header />
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
