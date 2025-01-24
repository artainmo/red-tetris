import React from "react";
import { redOctoberRegular } from "../style/fonts";
import { colors } from "../style/colors";
import Button from "../components/shared/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	
	const navigate = useNavigate();
	
	const landingPageContainerStyle = {
		width: '100vw',
		height: '100vh',
		backgroundColor: colors.backgroundDarkGrey,
		padding: '40px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		boxSizing: 'border-box',
	}

	const titleContainerStyle = {
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		margin: 'auto'
	}
	
	const redStyle = {
		color: colors.sovietRed,
		...redOctoberRegular,
		fontSize: '72px',
		margin: 0,
		padding: 0,
	}

	const whiteStyle = {
		color: colors.white,
		...redOctoberRegular,
		fontSize: '72px',
		margin: 0,
		padding: 0,
	}

	const buttonContainerStyle = {
		width: '100%',
		height: '40px',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}

	const redContainerStyle = {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}

	return (
		<div style={landingPageContainerStyle}>
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
			<div style={buttonContainerStyle}>
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
