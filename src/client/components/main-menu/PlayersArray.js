import React from 'react'
import {
	arrayContainerStyle,
	arrayDivStyle,
	titleDivStyle,
	titleStyle,
	delimiterStyle,
	arrayDisplayDivStyle,
} from '../../style/panelStyle'

const PlayersArray = () => {
	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div style={titleDivStyle}>
					<h2 style={titleStyle}>Players Available</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div style={arrayDisplayDivStyle}>players there</div>
			</div>
		</div>
	)
}

export default PlayersArray
