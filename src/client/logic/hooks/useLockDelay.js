/*
	
*/

import { useState, useEffect, useCallback, useRef } from 'react';

const useLockDelay = (onLockCallback, lockDelay) => {
	const [isActive, setIsActive] = useState(false);
	const lockTimeoutIdRef = useRef(null);
	const remainingTimeRef = useRef(lockDelay);
	const lastStartTimeRef = useRef(0);
  
	const clearLockDelay = useCallback(() => {
		if (lockTimeoutIdRef.current !== null) {
			clearTimeout(lockTimeoutIdRef.current);
			lockTimeoutIdRef.current = null;
	  	}
	}, []);

	const startLockDelay = useCallback(() => {
	  	clearLockDelay();
	  	lockTimeoutIdRef.current = setTimeout(() => {
			onLockCallback();
	  	}, remainingTimeRef.current);
	  	lastStartTimeRef.current = Date.now();
	  	setIsActive(true);
	}, [clearLockDelay, onLockCallback, remainingTimeRef.current]);
  
	const resetLockDelay = useCallback(() => {
		startLockDelay();
	}, [startLockDelay]);
  
	const pause = useCallback(() => {
	  	if (lockTimeoutIdRef.current) {
			clearTimeout(lockTimeoutIdRef.current);
			lockTimeoutIdRef.current = null;
			remainingTimeRef.current -= Date.now() - lastStartTimeRef.current;
			setIsActive(false);
	  	}
	}, []);
  
	const resume = useCallback(() => {
		if (!lockTimeoutIdRef.current && !isActive) {
			startLockDelay();
	  	}
	}, [isActive, startLockDelay]);
  
	useEffect(() => {
	  	return () => {
			clearLockDelay();
	  	};
	}, [clearLockDelay]);
  
	return { start: startLockDelay, reset: resetLockDelay, clear: clearLockDelay, pause, resume };
};

export default useLockDelay;
