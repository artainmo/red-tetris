import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setIsGameOver } from "../redux/slices/gameplaySlice";
import { pageMainContainerStyle, buttonContainerStyle } from "../style/containersStyle";
import FullPageWithCentralText from "../components/shared/FullPageWithCentralText";
import { useSelector } from "react-redux";

const GameEnd = ({wonOrLostText}) => {
	
	const navigate = useNavigate();

	return (
		<div style={pageMainContainerStyle}>
			<FullPageWithCentralText centralText={wonOrLostText}/>
			<div style={buttonContainerStyle}>
				<RedButton
					textContent='Back To Menu'
					onClick={() => {
						navigate('/main_menu');
					}}
				/>
			</div>
		</div>
	);
}

export default GameEnd;
