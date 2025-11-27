import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

const PlayerCard = ({ username }) => {
	const PlayerCardStyle = {
		height: '100%',
		width: '100%',
		border: '2px solid white',
		margin: '0.5rem',
	}

	return (
		<Card style={PlayerCardStyle}>
			<Card.Body>
				<Card.Title>{username}</Card.Title>
				<Card.Text>A picture will go here</Card.Text>
			</Card.Body>
		</Card>
	)
}
PlayerCard.propTypes = {
	username: PropTypes.string.isRequired,
}

export default PlayerCard
