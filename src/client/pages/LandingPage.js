import React from "react";
import Button from "../components/shared/Button";
import { useNavigate } from "react-router-dom";
import { whiteStyle, redStyle, pageMainContainerStyle, startButtonContainerStyle } from "../style/pagesStyle";

const LandingPage = () => {
	
	const navigate = useNavigate();

	const titleContainerStyle = {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		margin: 'auto'
	}

	const redContainerStyle = {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}

	return (
		<div style={pageMainContainerStyle}>
			<div style={titleContainerStyle}>
				<div style={redContainerStyle}>
					<p style={redStyle}>
						Red
					</p>
				</div>
				<div style={redContainerStyle}>
					<p style={whiteStyle}>
						Tetris
					</p>
				</div>
			</div>
			<div style={startButtonContainerStyle}>
				<Button
					textContent='Start'
					onClick={() => {
						navigate('/auth');
					}}
				/>
			</div>
		</div>
	)
}

export default LandingPage;
