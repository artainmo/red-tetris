import React from "react";
import { Card, Col } from "react-bootstrap";

const PlayerCard = ({username}) => {
	
	const PlayerCardStyle = {
		height: '100%',
		width: '30%',
		border: '2px solid white',
		margin: '2rem'
	}

	return (
		// <Col sm={12} md={6} className="mb-4">
			<Card style={PlayerCardStyle}>
				<Card.Body>
					<Card.Title>
						{username}
					</Card.Title>
					<Card.Text>
						A picture will go here
					</Card.Text>
				</Card.Body>
			</Card>
		// </Col>
	)
	;
}

export default PlayerCard;
