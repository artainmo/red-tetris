import React, { useState, useEffect } from 'react'
import {
	arrayContainerStyle,
	arrayDivStyle,
	delimiterStyle,
	fullWhiteMenuPanelStyle,
	titleStyle,
} from '../../style/panelStyle'
import { getBestScores } from '../../api/http.api'

const RightMenuPanel = () => {
	const [scores, setScores] = useState([])

	const fetchBestScores = async () => {
		try {
			const data = await getBestScores()
			console.log('fetched best scores:', data)
			setScores(data.scores)
		} catch (error) {
			console.error('Error fetching best scores:', error)
		}
	}

	useEffect(() => {
		fetchBestScores()
	}, [])

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<div style={arrayContainerStyle}>
				<div style={arrayDivStyle}>
					<div>
						<h2 style={titleStyle}>Best Scores</h2>
						<div style={delimiterStyle}></div>
					</div>
					<div>
						{scores.length > 0 &&
							scores.map((score, index) => (
								<p key={index}>
									{score.username} - <mark>{score.bestScore}</mark> points
								</p>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default RightMenuPanel
