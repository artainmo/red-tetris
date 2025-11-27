import React from 'react'
import {
	whiteStyle,
	redStyle,
	redContainerStyle,
	titleContainerStyle,
} from '../../style/containersStyle'

export default function RedTetrisTitle() {
	return (
		<div style={titleContainerStyle}>
			<div style={redContainerStyle}>
				<p style={redStyle}>Red</p>
			</div>
			<div style={redContainerStyle}>
				<p style={whiteStyle}>Tetris</p>
			</div>
		</div>
	)
}
