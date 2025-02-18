import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGameTime } from "../redux/slices/gameTimeSlice";

const useManageTime = (gameIsActive) => {

	const dispatch = useDispatch();

	const time = useSelector((state) => state.gameTime.currentTime);
	const [intervalId, setIntervalId] = useState(null);

	useEffect(() => {
		if (gameIsActive) {
		const id = setInterval(() => {
			dispatch(updateGameTime())
			//setTime((prevTime) => prevTime + 1000); // Increment time by 1 second
		}, 1000);

		setIntervalId(id);

		return () => clearInterval(id); // Clean up on unmount
		}
	}, [gameIsActive]);

	useEffect(() => {
		if (time >= 60 * 60 * 1000) { // 60 minutes * 60 seconds * 1000 milliseconds
		clearInterval(intervalId);
		}
	}, [time, intervalId]);

	const formatTime = (milliseconds) => {
		const minutes = Math.floor(milliseconds / (60 * 1000));
		const seconds = ((milliseconds % (60 * 1000)) / 1000).toFixed(0);
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return <div>{formatTime(time)}</div>;
}

export default useManageTime;
