import React from "react";
import { useState } from "react";
import { fullTransparentMenuPanelStyle } from "../../style/panelStyle";
import { statsContainerStyle, stackedContainerStyle, cardContainerStyle, smallWhiteStyle } from "../../style/containersStyle";
import PlayerCard from "./PlayerCard";
import { Col, Container, Row } from "react-bootstrap";

const MultiPlayerPanel = () => {

	const gameTime = useState('0:0') // useSelector((state) => state.gameTimeSlice.updateGameTime);
	const players = [
		{ username: "Player 1"},
		{ username: "Player 2"},
		{ username: "Player 3"},
		{ username: "Player 4"},
	]

	return (
		<div style={fullTransparentMenuPanelStyle}>
			<div style={statsContainerStyle}>
				{/* <div style={stackedContainerStyle}> */}
					<p style={smallWhiteStyle}>
						GAME DURATION
					</p>
					<p style={smallWhiteStyle}>
						{gameTime}
					</p>
				</div>
				<Container fluid>
				<Row className="d-flex flex-wrap">
					<Col md={6} sm={12}>
						<PlayerCard username={"Player 1"} />
					</Col>
					<Col md={6} sm={12}>
						<PlayerCard username={"Player 2"} />
					</Col>
				</Row>
				<Row>
					<Col md={6} sm={12}>
						<PlayerCard username={"Player 3"} />
					</Col>
					<Col md={6} sm={12}>
						<PlayerCard username={"Player 4"} />
					</Col>
				</Row>
				</Container>
			{/* </div> */}
		</div>
	);
}

export default MultiPlayerPanel;
