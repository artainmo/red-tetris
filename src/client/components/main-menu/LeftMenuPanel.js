import React, { useState, useEffect } from 'react'
import {
	arrayContainerStyle,
	arrayDivStyle,
	delimiterStyle,
	fullWhiteMenuPanelStyle,
	titleStyle,
} from '../../style/panelStyle'
import { useSelector } from 'react-redux'
import { getUserScores } from '../../api/http.api'

const LeftMenuPanel = () => {
	const user = useSelector((state) => state.auth.user)
	const [scores, setScores] = useState([])

	const fetchScores = async () => {
		try {
			if (user === null) {
				return
			}
			const data = await getUserScores(user)
			setScores(data.scores || [])
			console.log('fetched games:', data)
		} catch (error) {
			console.error('Error fetching joinable games:', error)
		}
	}

	useEffect(() => {
		console.log('fetching scores for user:', user)
		fetchScores()
	}, [user])

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<div style={arrayContainerStyle}>
				<div style={arrayDivStyle}>
					<div>
						<h2 style={titleStyle}>Your Scores</h2>
						<div style={delimiterStyle}></div>
					</div>
					<div>
						{scores &&
							scores.length > 0 &&
							scores.map((score, index) => (
								<p key={index}>
									<small>
										{new Date(score.createdAt).toLocaleDateString('fr-FR', {
											day: '2-digit',
											month: '2-digit',
										})}
									</small>
									{' - '}
									{score.score} <mark>points</mark>
									{' - in game '}
									{score.gameId}
								</p>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default LeftMenuPanel
