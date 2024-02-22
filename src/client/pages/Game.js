import React from "react";
import Header from "../components/Header";
import StopWatch from '../components/Stopwatch';
import NextPiece from "../components/NextPiece";
import { landingPageStyle, mainContainerStyle } from "../style/mainStyle";
import TetrisBoard from "./TetrisBoard";

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
	
	return (
		<div style={mainContainerStyle}>
			<Header />
			<div style={landingPageStyle}>
				<div style={gameElemsStyle}>
					<div style={leftPannelStyle}>
						<TetrisBoard />
					</div>
					<div style={rightPannelStyle}>
						<NextPiece />
						<StopWatch />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Game;
