import React, { useState, useEffect } from "react";
import BestScoresArray from "./BestScoresArray";
import { fullWhiteMenuPanelStyle } from "../../style/panelStyle";
import { getAllGames } from "../../api/http.api";


const RightMenuPanel = () => {
	
	const [scores,setScores] = useState({})

	useEffect(() => {
		const getBestScores = async () => {
			try {
				const games = (await getAllGames()).games;
				const newScores = {};
				games.forEach(g => {
				  const currScores = [g.player1_score, g.player2_score, g.player3_score, g.player4_score];
				  const bestScore = Math.max(...currScores);
				  const bestScoreIndex = currScores.indexOf(bestScore);
				  switch (bestScoreIndex) {
					case 0:
					  	if (!(Object.keys(newScores).includes(g.player1_id) && newScores[g.player1_id] > bestScore))
					  		newScores[g.player1_id] = bestScore;
					  	break;
					case 1:
					  	if (!(Object.keys(newScores).includes(g.player2_id) && newScores[g.player2_id] > bestScore))
					  		newScores[g.player2_id] = bestScore;
					  	break;
					case 2:
					  	if (!(Object.keys(newScores).includes(g.player3_id) && newScores[g.player3_id] > bestScore))
					  		newScores[g.player3_id] = bestScore;
					  	break;
					case 3:
						if (!(Object.keys(newScores).includes(g.player4_id) && newScores[g.player4_id] > bestScore))
					  		newScores[g.player4_id] = bestScore;
					  	break;
					default:
					  console.log('No best score found.');
					  break;
				  }
				});
				setScores(newScores);
			  } catch (error) {
				console.error(error);
			  }
			};
			getBestScores();
	  }, []);

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<BestScoresArray scores={scores}/>
		</div>
	);

}

export default RightMenuPanel;
