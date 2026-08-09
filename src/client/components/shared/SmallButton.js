import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { redOctoberRegular } from '../../style/fonts'
import { colors } from '../../style/colors'

const SmallButton = ({ textContent, onClick }) => {
	const [isHovered, setIsHovered] = useState(false)

	const textStyle = {
		...redOctoberRegular,
		color: 'black',
		fontSize: '14px',
		lineHeight: '27px',
		textDecoration: 'none',
		whiteSpace: 'nowrap',
		margin: 0,
	}

	const buttonStyle = {
		backgroundColor: isHovered ? colors.backgroundDarkGrey : colors.white,
		minWidth: '70px',
		height: '30px',
		padding: '0 16px',
		borderRadius: '25px',
		boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		transition: 'background-color 0.3s',
		border: '1px solid black',
		cursor: 'pointer',
		outline: 'none',
		margin: '5px',
	}

	return (
		<button
			style={buttonStyle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			<p style={textStyle}>{textContent}</p>
		</button>
	)
}

SmallButton.propTypes = {
	textContent: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
}

export default SmallButton
