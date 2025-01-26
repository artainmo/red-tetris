import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userConnect } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { colors } from '../style/colors';
import Button from '../components/shared/Button';
import { whiteStyle, redStyle, pageMainContainerStyle, startButtonContainerStyle } from "../style/pagesStyle";

const Auth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated, user, nameTooLong, nameInvalidChars } = useSelector((state) => state.auth);
	
	const [localName, setLocalName] = useState('');
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false);
	const [connectionAttempt, setConnectionAttempt] = useState(false);

	const handleAuth = () => {
		if (!localName) {
			setEmptyInputErrMsg(true);
			return;
		}
		setConnectionAttempt(true);
		dispatch(userConnect(localName));
	}

	useEffect(() => {
		if (connectionAttempt && user && isAuthenticated) {
			navigate('/main_menu');
		}
	}, [user, navigate, connectionAttempt, isAuthenticated]);
	
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

	const mainPartContainerStyle = {
		width: '100%',
		height: 'calc(100vh - 40px)',
		margin: 0,
		padding: 0,
		paddingTop: '40px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		boxSizing: 'border-box',
	}

	const textsContainerStyle = {
		width: '100%',
		height: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
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
					<Button style={startButtonContainerStyle}
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
