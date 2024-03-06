import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGameTime } from "../redux/slices/gameTimeSlice";

const Stopwatch = () => {

	const dispatch = useDispatch();
	const currentTime = useSelector((state) => state.gameTime.currentTime);
	const isGameActive = useSelector((state) => state.gameTime.isGameActive);
	
	useEffect(() => {
		let interval = null;

		if (isGameActive) {
			interval = setInterval(() => {
                dispatch(updateGameTime());
            }, 1000);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);

	}, [isGameActive, dispatch]);

	const formatTime = (time) => {
		const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
		const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
		const hours = `0${Math.floor(time / 3600000)}`.slice(-2);

		return `${hours}:${minutes}:${seconds}`;
	}

	const stopwatchContainerStyle = {
		backgroundColor: 'yellow',
		width: '100%',
		height: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
	
	return (
		<div style={stopwatchContainerStyle}>
			<h2>Stopwatch</h2>
			<div>{formatTime(currentTime)}</div>
		</div>
	);
}

export default Stopwatch;
