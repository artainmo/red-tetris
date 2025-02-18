import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGameTime } from "../redux/slices/gameTimeSlice";
import { startGame } from "../redux/slices/gameTimeSlice";

const useManageTime = () => {

	const dispatch = useDispatch();

	const time = useSelector((state) => state.gameTime.currentTime);
	const gameActive = useSelector((state) => state.gameTime.isGameActive)
	const [intervalId, setIntervalId] = useState(null);

	useEffect(() => {
		if (!gameActive)
			dispatch(startGame())
		if (gameActive) {
			const id = setInterval(() => {
			dispatch(updateGameTime())
			//setTime((prevTime) => prevTime + 1000); // Increment time by 1 second
		}, 1000);

		setIntervalId(id);

		return () => clearInterval(id); // Clean up on unmount
		}
	}, [gameActive]);


	useEffect(() => {
		if (time >= 60 * 60 * 1000) { // 60 minutes * 60 seconds * 1000 milliseconds
		clearInterval(intervalId);
		}
	}, [time, intervalId]);

	return time;
}

export default useManageTime;
