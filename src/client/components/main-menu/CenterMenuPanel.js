import React, { useState, useEffect } from 'react'
import RoomsArray from './RoomsArray'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RedButton from '../shared/RedButton'
import { clearRoomError } from '../../redux/slices/roomSlice'
import {
	fullWhiteMenuPanelStyle,
	middlePanelStyle,
	middleArrayContainerStyle,
} from '../../style/panelStyle'

const CenterMenuPanel = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [localName, setLocalName] = useState('')
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false)
	const socketErrMsg = useSelector((state) => state.socket.error)
	//Set by 'joinRoomThunk' (see roomSlice.js) when creating/joining a room fails - e.g. the room name
	//was already used by a finished game. 'Game.js' redirects back here as soon as this is set, so it's
	//shown right where the user typed the name.
	const roomErrMsg = useSelector((state) => state.room.error)
	const { nameTooLong, nameInvalidChars } = useSelector((state) => state.auth)
	const inputStyle = {
		backgroundColor: 'white',
		border: 'none',
		borderRadius: '20px',
		fontSize: '16px',
		padding: '10px 20px',
		margin: '24px',
		width: '60%',
		textAlign: 'center',
	}

	const errMsgStyle = {
		color: 'red',
		fontSize: '12px',
		textAlign: 'center',
		//'buttonDivStyle' below is a flex column, where sibling margins don't collapse the way they do in
		//normal block flow - so the small top margin here (replacing the browser's ~1em default) is what
		//actually shortens the gap to the input right above it, without touching that input's own margin
		//(which would also shrink its gap to the "Create Game" button when no error is shown).
		margin: '4px 0 8px',
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
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	}

	return (
		<div style={middlePanelStyle}>
			<div style={middleArrayContainerStyle}>
				<div style={buttonColStyle}>
					<div style={buttonDivStyle}>
						<input
							style={inputStyle}
							type="text"
							placeholder="Game name"
							value={localName}
							onChange={(e) => {
								setLocalName(e.target.value)
								setEmptyInputErrMsg(false)
								if (roomErrMsg) {
									dispatch(clearRoomError())
								}
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
						{roomErrMsg && (
							<p style={errMsgStyle}>This game name has already been used</p>
						)}
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
