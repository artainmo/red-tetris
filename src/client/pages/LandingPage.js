import React from "react";
import Header from '../components/Header';
import backgroundImage from '../assets/USSR_Flag.jpeg';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

	const navigate = useNavigate();
	
	const handleClick = () => {
		navigate('/auth');
	}

	const landingPageContainerStyle = {
		height: '100vh',
		width: '100vw',
		margin: 0
	}

	const landingPageStyle = {
		height: 'calc(100vh - 80px)',
		width: '100%',
		backgroundImage: `url(${backgroundImage})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}

	const textStyle = {
		margin: 0,
		fontSize: 72,
		color: 'white',
		paddingBottom: 36
	}

	const buttonStyle = {
		margin: 0,
		backgroundColor: 'black',
		height: '80px',
		width: '400px',
		color: 'white',
		fontSize: 48,
		border: 'none',
		cursor: 'pointer',
		borderRadius: '40px'
	}

	const blockStyle = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
	
	return (
		<div style={landingPageContainerStyle}>
			<Header/>
			<div style={landingPageStyle}>
				<div style={blockStyle}>
					<p style={textStyle} >Welcome Comrade !</p>
					<button style={buttonStyle} onClick={handleClick}>Start !</button> 
				</div>
			</div>
		</div>
	);
}

export default LandingPage;
