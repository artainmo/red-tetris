import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userConnect } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { colors } from '../style/colors';
import Button from '../components/shared/Button';
import { redOctoberRegular } from '../style/fonts';

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
		margin: '24px'
	}

	const errMsgStyle = {
		color: 'red',
		fontSize: '12px',
	}

	const authMainContainerStyle = {
		width: '100vw',
		height: '100vh',
		backgroundColor: colors.backgroundDarkGrey,
		margin: 0,
		padding: '40px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
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

	const buttonPartContainerStyle = {
		width: '100%',
		height: '40px',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	}

	const textsContainerStyle = {
		width: '100%',
		height: 'auto',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',

	}

	const whiteStyle = {
		...redOctoberRegular,
		color: colors.white,
		fontSize: '72px',
		margin: 0,
		padding: 0,
		paddingBottom: '24px',
	}

	const redStyle = {
		...redOctoberRegular,
		color: colors.sovietRed,
		fontSize: '48px',
		margin: 0,
		padding: 0,
		paddingBottom: '24px',
	}

	return (
		<div style={authMainContainerStyle}>
			<div style={mainPartContainerStyle}>
				<div style={textsContainerStyle}>
					<p style={whiteStyle}>Time to register</p>
					<p style={redStyle}>Comrade !!!</p>
				</div>
				<div>
					<input 
						style={inputStyle}
						type='text'
						placeholder='enter your pseudo'
						value={localName}
						onChange={(e) => {
							setLocalName(e.target.value);
							setEmptyInputErrMsg(false);
						}}
					/>
					{nameTooLong && <p style={errMsgStyle}>Please enter a shorter username</p>}
					{emptyInputErrMsg && <p style={errMsgStyle}>Empty inputs are invalid</p>}
					{nameInvalidChars && <p style={errMsgStyle}>Invalid characters</p>}
				</div>
			</div>
			<div style={buttonPartContainerStyle}>
				<Button
					textContent='Start'
					onClick={() => {
						handleAuth();
					}}
				/>
			</div>
		</div>
	);
}

export default Auth;
