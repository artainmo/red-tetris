import React from 'react'
import LeftMenuPanel from '../components/main-menu/LeftMenuPanel'
import CenterMenuPanel from '../components/main-menu/CenterMenuPanel'
import RightMenuPanel from '../components/main-menu/RightMenuPanel'
import {
	welcomeContainerStyle,
	welcomeWhiteStyle,
	redContainerStyle,
	pageMainContainerStyle,
} from '../style/containersStyle'
import { panelsStyle } from '../style/panelStyle'
import RedTetrisLogo from '../components/shared/RedTetrisLogo'
import { useSelector } from 'react-redux'

const MainMenu = () => {
	const username = useSelector((state) => state.auth.user)

	return (
		<div style={pageMainContainerStyle}>
			<div style={redContainerStyle}>
				<RedTetrisLogo firstLine="Red" secondLine="Tetris" />
				<div style={welcomeContainerStyle}>
					<div style={redContainerStyle}>
						<p style={welcomeWhiteStyle}>WELCOME</p>
					</div>
					<div style={redContainerStyle}>
						<p style={welcomeWhiteStyle}>{username}</p>
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

export default MainMenu
