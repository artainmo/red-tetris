import React, { useState, useEffect } from "react"
import ScoresArray from "./ScoresArray";
import { fullWhiteMenuPanelStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";
import { getGames } from "../../api/http.api";

const LeftMenuPanel = () => {

	const user = useSelector((state) => state.auth.user);
	const [scores,setScores] = useState([])

	useEffect(() => {
		const getScores = async () => {
			try {
				const games = (await getGames(user)).games;
				const gameScores = games.reduce((acc,g) => {
					if (g._player1 != null && g._player1_score != null && g._player1 == user)
						acc.push(g._player1_score)
					else if (g._player2 != null && g._player2_score != null && g._player2 == user)
						acc.push(g._player2_score)
					else if (g._player3 != null && g._player3_score != null && g._player3 == user)
						acc.push(g._player3_score)
					else if (g._player4 != null && g._player4_score != null && g._player4 == user)
						acc.push(g._player4_score)
					return acc ;
				}, []);
				setScores(gameScores);
			} catch (error) {
			  console.error(error);
			}
		  };
		  getScores();
	  }, [user]);

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<ScoresArray user={user} scores={scores} />
		</div>
	)

};

export default LeftMenuPanel;
