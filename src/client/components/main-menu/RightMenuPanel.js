import React, { useState, useEffect } from "react";
import BestScoresArray from "./BestScoresArray";
import { fullWhiteMenuPanelStyle } from "../../style/panelStyle";
import { getBestScores } from "../../api/http.api";


const RightMenuPanel = () => {
	
	const [scores,setScores] = useState({})

	const fetchBestScores = async () => {
		try {
			const data = await getBestScores();
			console.log("fetched best scores:", data);
			// setScores(data);
		} catch (error) {
			console.error("Error fetching best scores:", error);
		}
	};
	
	useEffect(() => {
		fetchBestScores();
	}, []);

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<BestScoresArray scores={scores}/>
		</div>
	);

}

export default RightMenuPanel;
