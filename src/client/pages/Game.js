import React from "react";
// import NextPiece from "../components/game/NextPiece";
import { landingPageStyle, mainContainerStyle } from "../style/mainStyle";
// import TetrisBoard from "../components/game/TetrisBoard";
// import GameActionsPannel from "../components/game/GameActionsPannel";

const Game = () => {
	
	const leftPannelStyle = {
		height: '100%',
		width: '50%',
		backgroundColor: 'green',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
	
	const rightPannelStyle = {
		height: '100%',
		width: '50%',
		backgroundColor: 'blue',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}

	const gameElemsStyle = {
		width: '50%',
		height: '90%',
		display: 'flex',
	}

	const startPannelStyle = {

	}
	
	return (
		<div style={mainContainerStyle}>
			<div style={landingPageStyle}>
				<div style={startPannelStyle}>
					{/* <GameActionsPannel /> */}
				</div>
				<div style={gameElemsStyle}>
					<div style={leftPannelStyle}>
						{/* <TetrisBoard /> */}
					</div>
					<div style={rightPannelStyle}>
						{/* <NextPiece /> */}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Game;
