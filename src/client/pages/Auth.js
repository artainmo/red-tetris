import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userConnect } from '../redux/slices/authSlice';
import { socketConnectThunk } from '../redux/slices/socketSlice';
import { useNavigate } from 'react-router-dom';
import RedButton from '../components/shared/RedButton';
import { whiteStyle, redStyle, pageMainContainerStyle, buttonContainerStyle, mainPartContainerStyle, textsContainerStyle } from "../style/containersStyle";

const Auth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated, user, nameTooLong, nameInvalidChars } = useSelector((state) => state.auth);
	
	const [localName, setLocalName] = useState('');
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false);
	const [connectionAttempt, setConnectionAttempt] = useState(false);
	const socketState = useSelector((state) => state.socket);
	const { status: socketStatus, error: socketErrMsg } = socketState;

	const handleAuth = async () => {
		console.log("handle Auth!")
		if (!localName) {
			setEmptyInputErrMsg(true);
			return;
		}
		console.log("handle Auth!")
		setConnectionAttempt(true);
		const data = await dispatch(userConnect(localName));
		console.log("data from dispatch:", data);
		try {
			const socket = await dispatch(socketConnectThunk(data.payload.jwt)).unwrap();
		} catch (err) {
			console.log("Socket connection failed:", err);
		}
	}

	useEffect(() => {
		if (connectionAttempt && user && isAuthenticated && socketStatus === 'connected') {
			console.log("navigating to main_menu");
			navigate('/main_menu');
		}
	}, [user, navigate, connectionAttempt, isAuthenticated, socketStatus]);
	
	const inputStyle = {
		backgroundColor: 'white',
		border: 'none',
		borderRadius: '20px',
		fontSize: '16px',
		padding: '10px 20px',
		margin: '24px',
		width: '25%'
	}

	const errMsgStyle = {
		color: 'red',
		fontSize: '12px',
	}

	return (
		<div style={pageMainContainerStyle}>
			<div style={mainPartContainerStyle}>
				<div style={textsContainerStyle}>
					<p style={whiteStyle}>TIME TO REGISTER</p>
					<p style={redStyle}>COMRADE !!!</p>
					<input 
						style={inputStyle}
						type='text'
						placeholder='Enter your pseudo'
						value={localName}
						onChange={(e) => {
							setLocalName(e.target.value);
							setEmptyInputErrMsg(false);
						}}
					/>
					{nameTooLong && <p style={errMsgStyle}>Please enter a shorter username</p>}
					{emptyInputErrMsg && <p style={errMsgStyle}>Empty inputs are invalid</p>}
					{nameInvalidChars && <p style={errMsgStyle}>Invalid characters</p>}
					{socketErrMsg && <p style={errMsgStyle}>{socketErrMsg}</p>}
					<RedButton style={buttonContainerStyle}
						textContent='Start'
						onClick={() => {
							handleAuth();
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default Auth;
