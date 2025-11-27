import React, { useState, useEffect } from 'react'
import ScoresArray from './ScoresArray'
import { fullWhiteMenuPanelStyle } from '../../style/panelStyle'
import { useSelector } from 'react-redux'
import { getUserScores } from '../../api/http.api'

const LeftMenuPanel = () => {
	const user = useSelector((state) => state.auth.user)
	const [scores, setScores] = useState([])
	const [loading, setLoading] = useState(false)

	const fetchScores = async () => {
		setLoading(true)
		try {
			if (user === null) return
			const data = await getUserScores(user)
			// setRooms(data.games || []);
			console.log('fetched games:', data)
		} catch (error) {
			console.error('Error fetching joinable games:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		console.log('fetching scores for user:', user)
		fetchScores()
	}, [user])

	return (
		<div style={fullWhiteMenuPanelStyle}>
			<ScoresArray user={user} scores={scores} />
		</div>
	)
}

export default LeftMenuPanel
