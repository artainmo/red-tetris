/*
	This component is handling matchmaking for multiplayer 
	and the frontend part of game creation for single players
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pageMainContainerStyle, buttonContainerStyle } from "../style/containersStyle";
import FullPageWithCentralText from "../components/shared/FullPageWithCentralText";
import RedButton from "../components/shared/RedButton";
import { endGame } from "../redux/slices/gameTimeSlice";
import { handleGameOverThunk, resetGame, setIsGameOver } from "../redux/slices/currentGameSlice";
import { resetGameplay } from "../redux/slices/gameplaySlice";

const Lobby = () => {
	
	const dispatch = useDispatch();
	const [matchmakingText, setMatchmakingText] = useState('Matchmaking In Progress');
	const [gameStartingSoonText, setGameStartingSoonText] = useState('New players joined the game');
	const [dotCount, setDotCount] = useState(0);
	const playersJoinedTheGame = useSelector((state) => state.currentGame.playersJoinedTheGame)
	const username = useSelector((state) => state.auth.user)

	const navigate = useNavigate();
	
	/* used to add the "..." dynamically in the matchmaking text */
	useEffect(() => {
		console.log("useEffect matchmaking")
		
		const interval = setInterval(() => {
			if (dotCount < 3) {
				setMatchmakingText(matchmakingText => matchmakingText + '.');
				setDotCount(dotCount + 1);
			} else {
				setMatchmakingText('Matchmaking In Progress');
				setDotCount(0);
			}
		}, 500);

		if (playersJoinedTheGame)
			console.log("joined multi")
		
		return () => clearInterval(interval);



	}, [setMatchmakingText,dotCount,playersJoinedTheGame]);

	const handleCancelButton = () => {
		// add some API call to remove the player form the match
		console.log('should cancel the game');
		dispatch(handleGameOverThunk({user: username, score: 0}))
		dispatch(setIsGameOver(true))
		dispatch(endGame());
		dispatch(resetGame());
		dispatch(resetGameplay());
		navigate('/main_menu');
	}
	
	console.log("player joined " + playersJoinedTheGame)
	return (
		<div style={pageMainContainerStyle}>
			{
				/* ca serait cool de faire un countdown de 10 seconds si on a le temps */
				playersJoinedTheGame ? 
				<FullPageWithCentralText firstLine={gameStartingSoonText} secondLine={"Game will start soon."}/>
				:
				<FullPageWithCentralText firstLine={matchmakingText} secondLine={""}/>
			}
			<div style={buttonContainerStyle}>
				<RedButton
					textContent='Cancel'
					onClick={handleCancelButton}
				/>
			</div>
		</div>
	);
}

export default Lobby;
