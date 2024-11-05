/* leverages api call and socket.io calls to process matchmaking process */

import React from "react";
import { useNavigate } from "react-router-dom";
import { createSoloGameThunk } from "../../redux/slices/currentGameSlice";
import { useSelector } from "react-redux";

export const soloGameCreation = (username) => {
	// first, use the async thunk to create the game
	createSoloGameThunk(username);
	// then, redirect ot the game itself

}

export const multiGameCreation = () => {

}
