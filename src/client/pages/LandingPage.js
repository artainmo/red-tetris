import React from "react";
import Header from '../components/shared/Header';
import { useNavigate } from "react-router-dom";
import { mainContainerStyle, landingPageStyle, blockStyle, buttonStyle, textStyle } from '../style/mainStyle';

const LandingPage = () => {

	const navigate = useNavigate();
	
	const handleClick = () => {
		navigate('/auth');
	}
	
	return (
		<div style={mainContainerStyle}>
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
