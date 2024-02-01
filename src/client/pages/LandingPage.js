import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const navigate = useNavigate();
	
	return (
		<div>
			<button onClick={() => navigate('/tetris')}>
				Start Playing
			</button>
		</div>
	)
}

export default LandingPage;
