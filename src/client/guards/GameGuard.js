import React from "react";
import { useSelector } from "react-redux";

const GameGuard = ({children}) => {

	const isCurrentGame = useSelector((state) => state.currentGame.id);
	
	if (!isCurrentGame) {
		return <Navigate to="/game_menu" replace />;
	}
	
	return children;
}

export default GameGuard;
