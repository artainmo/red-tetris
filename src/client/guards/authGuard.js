import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
	console.log('guard activated and passed');
	
	return children;
}

export default AuthGuard;
