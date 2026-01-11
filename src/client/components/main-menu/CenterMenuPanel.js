import React, { useState, useEffect } from 'react'
import RoomsArray from './RoomsArray'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RedButton from '../shared/RedButton'
import {
	fullWhiteMenuPanelStyle,
	middlePanelStyle,
	middleArrayContainerStyle,
} from '../../style/panelStyle'

const CenterMenuPanel = () => {
	const navigate = useNavigate()
	const [localName, setLocalName] = useState('')
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false)
	const socketErrMsg = useSelector((state) => state.socket.error)
	const { nameTooLong, nameInvalidChars } = useSelector((state) => state.auth)
	const inputStyle = {
		backgroundColor: 'white',
		border: 'none',
		borderRadius: '20px',
		fontSize: '16px',
		padding: '10px 20px',
		margin: '24px',
		width: '60%',
	}

	const errMsgStyle = {
		color: 'red',
		fontSize: '12px',
	}

	const [gameCreated, setGameCreated] = useState(false)

	const username = useSelector((state) => state.auth.user)

	const handleCreateGame = async () => {
		if (!localName) {
			setEmptyInputErrMsg(true)
			return
		}
		navigate('/game/' + localName + '/' + username)
	}

	// useEffect(() => {
	// 	if (gameCreated && gameId && username) {
	// 		setGameCreated(false)
	// 		navigate(`/game/${gameId}`)
	// 	}
	// }, [navigate, gameCreated, gameId, username])

	const buttonColStyle = {
		height: 'fit-content',
		display: 'flex-column',
		justifyContent: 'space-around',
		margin: 'auto',
		padding: 'auto',
	}

	const buttonDivStyle = {
		margin: '2rem',
		padding: 'auto',
	}

	return (
		<div style={middlePanelStyle}>
			<div style={middleArrayContainerStyle}>
				<div style={buttonColStyle}>
					<div style={buttonDivStyle}>
						<input
							style={inputStyle}
							type="text"
							placeholder="Enter game name to create"
							value={localName}
							onChange={(e) => {
								setLocalName(e.target.value)
								setEmptyInputErrMsg(false)
							}}
						/>
						{nameTooLong && (
							<p style={errMsgStyle}>Please enter a shorter username</p>
						)}
						{emptyInputErrMsg && (
							<p style={errMsgStyle}>Empty inputs are invalid</p>
						)}
						{nameInvalidChars && <p style={errMsgStyle}>Invalid characters</p>}
						{socketErrMsg && <p style={errMsgStyle}>{socketErrMsg}</p>}
						<RedButton textContent="Create Game" onClick={handleCreateGame} />
					</div>
				</div>
				<div style={fullWhiteMenuPanelStyle}>
					<RoomsArray />
				</div>
			</div>
		</div>
	)
}

export default CenterMenuPanel
