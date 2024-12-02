import React, { useState } from "react";
import { redOctoberRegular } from "../../style/fonts";
import { colors } from "../../style/colors";

const Button = ({
	textContent,
	onClick,
}) => {

	const [ isHovered, setIsHovered] = useState(false);
	
	const textStyle = {
		...redOctoberRegular,
		color: colors.white,
		fontSize: '18px',
		lineHeight: '27px',
		textDecoration: 'none',
		margin: 0,		
	}

	const buttonStyle = {
		backgroundColor: isHovered ? colors.sovietYellow : colors.sovietRed,
		width: '160px',
		height: '40px',
		borderRadius: '25px',
		boxSizing: 'border-box',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		transition: 'background-color 0.3s',
		border: 'none',
    	cursor: 'pointer',
    	outline: 'none',
	}

	return (
		<button
			style={buttonStyle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
		>
			<p style={textStyle}>
				{textContent}
			</p>
		</button>
	);
}

export default Button;
