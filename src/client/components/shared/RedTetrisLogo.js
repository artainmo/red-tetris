import React from 'react'
import PropTypes from 'prop-types'
import { logoWhiteStyle, logoRedStyle } from '../../style/containersStyle'

const logoContainerStyle = {
	height: '100%',
	display: 'flex-column',
	justifyContent: 'flex-end',
	flexGrow: 0,
	alignItems: 'center',
	alignSelf: 'center',
	margin: 'auto',
	position: 'absolute',
	top: '1rem',
	left: '1rem',
}

export default function RedTetrisLogo({ firstLine, secondLine }) {
	return (
		<div style={logoContainerStyle}>
			<div>
				<p style={logoRedStyle}>{firstLine}</p>
			</div>
			<div>
				<p style={logoWhiteStyle}>{secondLine}</p>
			</div>
		</div>
	)
}

RedTetrisLogo.propTypes = {
	firstLine: PropTypes.string.isRequired,
	secondLine: PropTypes.string.isRequired,
}
