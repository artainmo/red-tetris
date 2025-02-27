import React from "react";
import { arrayContainerStyle, arrayDivStyle, titleStyle, delimiterStyle } from "../../style/panelStyle";
import { useSelector } from "react-redux";

const ScoresArray = () => {
	
	const user = useSelector((state) => state.auth.user);
	const scores = useSelector((state) => Object.values(state.currentGame.scores))
	console.log("scores array")
	console.log(scores)

	// useEffect(async() => {
	// 	const games = await getGames(user);
	// 	console.log("games")
	// 	console.log(games)
	// 	scores = games.reduce(g => {
	// 		if (g._player1 != null && g._player1_score != null && g._player1 == user)
	// 			scores.add(g._player1_score)
	// 		else if (g._player2 != null && g._player2_score != null && g._player2 == user)
	// 			scores.add(g._player2_score)
	// 		else if (g._player3 != null && g._player3_score != null && g._player3 == user)
	// 			scores.add(g._player3_score)
	// 		else if (g._player4 != null && g._player4_score != null && g._player4 == user)
	// 			scores.add(g._player4_score)
	// 	}, []);
	//   }, []);

	return (
		<div style={arrayContainerStyle}>
			<div style={arrayDivStyle}>
				<div>
					<h2 style={titleStyle}>Your Scores</h2>
					<div style={delimiterStyle}></div>
				</div>
				<div>
				{
					scores.forEach((item, index) => (
							<p key={index}>{user} got {item} points</p>
					))
				}
				</div>	
			</div>
		</div>
	)
}

export default ScoresArray;
