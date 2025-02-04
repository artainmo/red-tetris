import React from "react";
import { useNavigate } from "react-router-dom";
import { pageMainContainerStyle, buttonContainerStyle } from "../style/containersStyle";
import FullPageWithCentralText from "../components/shared/FullPageWithCentralText";
import RedButton from "../components/shared/RedButton";

const GameEnd = ({firstLine, secondLine}) => {
	
	const navigate = useNavigate();

	return (
		<div style={pageMainContainerStyle}>
			<FullPageWithCentralText firstLine={firstLine} secondLine={secondLine}/>
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
