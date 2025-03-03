import React from "react";
import { useNavigate } from "react-router-dom";
import { pageMainContainerStyle, buttonContainerStyle } from "../style/containersStyle";
import FullPageWithCentralText from "../components/shared/FullPageWithCentralText";
import RedButton from "../components/shared/RedButton";
import { resetGame } from "../redux/slices/currentGameSlice";
import { resetGameplay } from "../redux/slices/gameplaySlice";
import { useDispatch } from "react-redux";

const GameEnd = ({firstLine, secondLine}) => {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<div style={pageMainContainerStyle}>
			<FullPageWithCentralText firstLine={firstLine} secondLine={secondLine}/>
			<div style={buttonContainerStyle}>
				<RedButton
					textContent='Back To Menu'
					onClick={() => {
						dispatch(resetGame());
						dispatch(resetGameplay());
						navigate('/main_menu');
					}}
				/>
			</div>
		</div>
	);
}

export default GameEnd;
