import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setName, userConnect } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { mainContainerStyle, landingPageStyle, blockStyle, buttonStyle, textStyle } from '../style/mainStyle';
import Header from '../components/Header';


const Auth = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, name, nameTooLong, nameInvalidChars } = useSelector((state) => state.auth);
	const [localName, setLocalName] = useState('');

	const handleAuth = () => {
		console.log('trying to login');
		dispatch(setName(localName)); // First, set the name in Redux state
        dispatch(userConnect(localName)); // Then, attempt to login
	}

	useEffect(() => {
		if (user !== null) {
			console.log('auth successful, goto main menu');
			navigate('/main_menu');
		}
	}, [user, navigate]);
	
	const inputStyle = {
		// complete that
	}

	const typoStyle = {
		// complete that
	}

  	if (user === null) {
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
						<button onClick={handleAuth} style={buttonStyle}>Go !</button>
					</div>
				</div>
			</div>
		);
  	} 
}

export default Auth;
