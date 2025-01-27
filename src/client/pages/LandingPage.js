import React from "react";
import Button from "../components/shared/Button";
import { useNavigate } from "react-router-dom";
import { pageMainContainerStyle, startButtonContainerStyle } from "../style/pagesStyle";
import RedTetrisTitle from "../components/shared/RedTetrisTitle";

const LandingPage = () => {
	
	const navigate = useNavigate();


	return (
		<div style={pageMainContainerStyle}>
			<RedTetrisTitle/>
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
