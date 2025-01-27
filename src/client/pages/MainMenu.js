import React, { useState } from "react";
import LeftMenuPanel from "../components/main-menu/LeftMenuPanel";
import CenterMenuPanel from "../components/main-menu/CenterMenuPanel";
import RightMenuPanel from "../components/main-menu/RightMenuPanel";
import { welcomeWhiteStyle, redContainerStyle, pageMainContainerStyle } from "../style/pagesStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";

const MainMenu = () => {
	
	const [username, setUsername] = useState('m3zh');

	const pannelsStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		margin: 0
	}

	const welcomeContainerStyle = {
		height: '100%',
		display: 'flex-column',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		margin: 'auto'
	}
	
	return (
		<div style={pageMainContainerStyle}>
			<div style={redContainerStyle}>
				<RedTetrisLogo/>
				<div style={welcomeContainerStyle}>
					<div style={redContainerStyle}>
						<p style={welcomeWhiteStyle}>
							WELCOME
						</p>
					</div>
					<div style={redContainerStyle}>
						<p style={welcomeWhiteStyle}>
							{username}
						</p>
					</div>
				</div>
			</div>
			<div style={pannelsStyle}>
				<LeftMenuPanel />
				<CenterMenuPanel />
				<RightMenuPanel />
			</div>
		</div>
	)
}

export default MainMenu;
