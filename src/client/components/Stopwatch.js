import React, { useEffect, useState } from "react";

const Stopwatch = () => {

	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(null);

	const startTimer = () => {
		setIsRunning(true);
	}
	
	const stopTimer = () => {
		setIsRunning(false);
	}

	const resetTimer = () => {
		setTime(0);
		setIsRunning(false);
	}

	useEffect(() => {
		let interval = null;

		if (isRunning) {
			interval = setInterval(() => {
				setTime(prevTime => prevTime + 1000); // Update time every 10 milliseconds
		}, 1000);
		} else if (!isRunning && time !== 0) 
		{
		clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [isRunning, time])

	const formatTime = (time) => {
		const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
		const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
		const hours = `0${Math.floor(time / 3600000)}`.slice(-2);

		return `${hours}:${minutes}:${seconds}`;	
	}
	
	return (
		<div>
			<h2>Stopwatch</h2>
			<div>{formatTime(time)}</div>
			<button onClick={startTimer} disabled={isRunning}>Start</button>
			<button onClick={stopTimer} disabled={!isRunning}>Stop</button>
			<button onClick={resetTimer}>Reset</button>
		</div>
	);
}

export default Stopwatch;
