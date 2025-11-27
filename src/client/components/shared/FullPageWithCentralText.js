import React from 'react'
import PropTypes from 'prop-types'
import {
	titleContainerStyle,
	mainPartContainerStyle,
	textsContainerStyle,
	redContainerStyle,
	whiteStyle,
	redStyle,
} from '../../style/containersStyle'
import RedTetrisLogo from './RedTetrisLogo'

const FullPageWithCentralText = ({ firstLine, secondLine }) => {
	return (
		<div style={titleContainerStyle}>
			<div style={redContainerStyle}>
				<RedTetrisLogo firstLine="Red" secondLine="Tetris" />
				<div style={mainPartContainerStyle}>
					<div style={textsContainerStyle}>
						<p style={whiteStyle}>{firstLine}</p>
						<p style={redStyle}>{secondLine}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

FullPageWithCentralText.propTypes = {
	firstLine: PropTypes.string.isRequired,
	secondLine: PropTypes.string.isRequired,
}

export default FullPageWithCentralText
