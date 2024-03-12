import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userConnect } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { mainContainerStyle, landingPageStyle, blockStyle, buttonStyle, textStyle } from '../style/mainStyle';
import Header from '../components/shared/Header';


const Auth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isAuthenticated, user, nameTooLong, nameInvalidChars, nameEmpty } = useSelector((state) => state.auth);
	
	const [localName, setLocalName] = useState('');
	const [emptyInputErrMsg, setEmptyInputErrMsg] = useState(false);
	const [connectionAttempt, setConnectionAttempt] = useState(false);

	const handleAuth = () => {
		setConnectionAttempt(true);
		(async () => {
			await dispatch(userConnect(localName));
		})();
	}

	useEffect(() => {
		/* debug stuff */
		console.log(`connection attempt = ${connectionAttempt}`);
		console.log(`user = ${user}`);
		console.log(`isAuthenticated = ${isAuthenticated}`);
		
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
		color: 'white',
		fontSize: '12px',
	}

	return (
		<div style={mainContainerStyle}>
			<Header/>
			<div style={landingPageStyle}>
				<div style={blockStyle}>
					<p style={textStyle} >Time To Register Comrade !</p>
					<input 
						style={inputStyle}
						type='text'
						placeholder='enter your pseudo'
						value={localName}
						onChange={(e) => setLocalName(e.target.value)}
					/>
					{nameTooLong && <p style={errMsgStyle}>Please enter a shorter username</p>}
					{emptyInputErrMsg && <p style={errMsgStyle}>Empty inputs are invalid</p>}
					<button onClick={handleAuth} style={buttonStyle}>Go !</button>
				</div>
			</div>
		</div>
	);
}

export default Auth;
