import { API_ENDPOINT } from "./api_endpoint"
const axios = require('axios');
axios.defaults.baseURL = API_ENDPOINT;

export const connect = async (name) => {
 	try {
    	const response = await axios.get("/connect/" + name);
		return {status: response.status, data: response.data};
 	} catch (e) {
		return {status: e.response.status, data: e.response.data};
  	}
}

export const getGames = async (name) => {
	var response = await axios.get("/games/" + name);
	return {status: response.status, data: response.data};
}

export const searchGame = async (name) => {
	const response = await axios.get("/game/search/" + name);
	return {status: response.status, data: response.data};
}

export const gameWaitForSomeoneToJoin = async (game) => {
	try {
		const response = await axios.post("/game/wait/join", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameWaitQuit = async (game) => {
	try {
		var response = await axios.patch("/game/wait/quit", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameWaitStart = async (game) => {
	try {
		var response = await axios.post("/game/wait/start", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameStart = async (game) => {
	try {
		var response = await axios.patch("/game/start", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameFinalScore = async (game, score1, score2=null) => {
	try {
    if (score2 === null) {
      var response = await axios.post(`/game/score/${score1}`, game);
    } else {
      var response = await axios.post(`/game/score/${score1}/${score2}`, game);
    }
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameQuit = async (game, name) => {
  if (game === null) return ;
	try {
		var response = await axios.patch("/game/quit/" + name, game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}

export const gameNext = async (game) => {
	try {
		var response = await axios.post("/game/next", game);
		return {status: response.status, data: response.data};
	} catch (e) {
		return {status: e.response.status, data: e.response.data};
	}
}
