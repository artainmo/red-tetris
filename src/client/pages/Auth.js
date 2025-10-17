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

	const userConnect = createAsyncThunk(
		'auth/userConnect',
		async (name, {rejectWithValue}) => {
			try {
				const response = await connect(name);
				
				if (response.status === 200) {
					return response.data;
				} else {
					return rejectWithValue(response.data);
				}
			} catch (err) {
				if (err.response && err.response.data) {
					return rejectWithValue(err.response.data);
				} else {
					return rejectWithValue({message: 'unknown error happened'});
				}
			}
		}
	);
	const handleAuth = () => {
		console.log("handle Auth!")
		if (!localName) {
			setEmptyInputErrMsg(true);
			return;
		}
		console.log("handle Auth!")
		setConnectionAttempt(true);
		dispatch(userConnect(localName));
		dispatch(socketConnectThunk())
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
