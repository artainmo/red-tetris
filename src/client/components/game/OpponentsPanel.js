import React from 'react'
import { useSelector } from 'react-redux'
import Panel from './Panel'
import { smallWhiteStyle } from '../../style/containersStyle'

export default function OpponentsPanel() {
	const host = useSelector((state) => state.room.host)
	const opponentsContainerStyle = {
		width: '100%',
		height: 'auto',
		alignItems: 'start',
		margin: 0,
	}

	const opponents = useSelector((state) => state.opponents)
	return (
		opponents &&
		opponents.byId &&
		Object.keys(opponents.byId).map((opponentId) => {
			const opponent = opponents.byId[opponentId]
			return (
				<div key={opponentId} style={opponentsContainerStyle}>
					<h4 style={smallWhiteStyle}>
						{opponentId}
						{opponentId === host ? ' (Host)' : ''}
					</h4>
					<Panel grid={opponent.grid} size={0.5} isOpponent={true} />
					<p style={smallWhiteStyle}>Score: {opponent.score}</p>
				</div>
			)
		})
	)
}
