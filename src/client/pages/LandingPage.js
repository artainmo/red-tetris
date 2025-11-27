import React from 'react'
import RedButton from '../components/shared/RedButton'
import { useNavigate } from 'react-router-dom'
import {
	pageMainContainerStyle,
	buttonContainerStyle,
} from '../style/containersStyle'
import RedTetrisTitle from '../components/shared/RedTetrisTitle'

const LandingPage = () => {
	const navigate = useNavigate()

	return (
		<div style={pageMainContainerStyle}>
			<RedTetrisTitle />
			<div style={buttonContainerStyle}>
				<RedButton
					textContent="Start"
					onClick={() => {
						navigate('/auth')
					}}
				/>
			</div>
		</div>
	)
}

export default LandingPage
