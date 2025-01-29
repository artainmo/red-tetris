import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
	const isAuthenticated = useSelector((state) => state.auth.user);

	if (!isAuthenticated) {
		console.log('authGuard : access denied !!!');
		return <Navigate to="/auth" replace />;
	}
	
	return children;
}

export default AuthGuard;
