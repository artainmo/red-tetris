import { useState, useEffect, useCallback, useRef } from 'react';

const useGravity = (updateFunction, updateArgs = []) => {
	const [isRunning, setIsRunning] = useState(false);
	const gravityTimeoutIdRef = useRef(null);
	const remainingTimeRef = useRef(gravityDelay);
	const lastStartTimeRef = useRef(0);

	const stop = useCallback(() => {
		if (gravityTimeoutIdRef.current) {
		  	clearTimeout(gravityTimeoutIdRef.current);
			gravityTimeoutIdRef.current = null;
		 	remainingTimeRef.current -= Date.now() - lastStartTimeRef.current;
		}
	}, []);

	const start = useCallback(() => {
		if (!gravityTimeoutIdRef.current) {
		  	lastStartTimeRef.current = Date.now();
		  	const updateAndRestart = () => {
				updateFunction(...updateArgs);
				gravityTimeoutIdRef.current = null;
				if (isRunning) {
			  		start();
				}
			};
			gravityTimeoutIdRef.current = setTimeout(updateAndRestart, remainingTimeRef.current);
		}
	}, [isRunning, updateFunction, updateArgs]);

	const reset = useCallback(() => {
		stop();
		remainingTimeRef.current = gravityDelay;
	}, [gravityDelay, stop]);
	
	const resume = useCallback(() => {
		if (!gravityTimeoutIdRef.current) {
			start();
		}
	}, [start]);

	useEffect(() => {
		if (isRunning) {
		  	start();
		} else {
		  	stop();
		}
		return stop;
	}, [isRunning, start, stop]);

	return { start: () => setIsRunning(true), stop: () => setIsRunning(false), reset, resume };
}

export default useGravity;
