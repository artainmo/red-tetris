import React, { useState } from "react";
import LeftMenuPanel from "../components/main-menu/LeftMenuPanel";
import CenterMenuPanel from "../components/main-menu/CenterMenuPanel";
import RightMenuPanel from "../components/main-menu/RightMenuPanel";
import { welcomeWhiteStyle, redContainerStyle, pageMainContainerStyle } from "../style/pagesStyle";
import { panelsStyle } from "../style/panelStyle";
import RedTetrisLogo from "../components/shared/RedTetrisLogo";
import { useSelector } from "react-redux";

const MainMenu = () => {
	
	const username = useSelector((state) => state.auth.user);

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
				<RedTetrisLogo firstLine="Red" secondLine="Tetris" />
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
			<div style={panelsStyle}>
				<LeftMenuPanel />
				<CenterMenuPanel />
				<RightMenuPanel />
			</div>
		</div>
	)
}

export default MainMenu;
