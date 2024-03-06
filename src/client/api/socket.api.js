import { API_ENDPOINT } from "./api_endpoint"
import { io } from "socket.io-client";

export const connect = () => {
  	return io(API_ENDPOINT);
}

export const disconnect = (socket) => {
  	socket.disconnect();
}

export const joinRoom = (socket, roomId) => {
  	socket.emit("joinRoom", roomId);
}

export const askNewPiece = (socket, roomId) => {
  	socket.emit('askNewPiece', roomId);
}

export const listenNewPiece = (socket, setNewPiece) => {
  	console.log("Listening to incoming piece");
  	socket.on('newPiece', (data) => {
		console.log("New incoming piece");
		setNewPiece(data);
  	});
}

/*
** gameStructure will consist of a double array representing the rows of pieces.
** And each array element will represent a piece via an object with the
** attributes, type and direction.
*/
export const sendPersonalGameStructure = (socket, roomId, gameStructure) => {
  	socket.emit('sendPersonalGameStructure',
      	{roomId: roomId, gameStructure: gameStructure});
}

export const listenOtherPlayerGameStructure = (socket, setOtherPlayerGameStructure) => {
  	socket.on('otherPlayerGameStructure', (data) => {
    	setOtherPlayerGameStructure(data);
  	});
}

export const sendNextGame = (socket, roomId, nextGame) => {
  	socket.emit('sendNextGame', {roomId: roomId, nextGame: nextGame});
}

export const listenNextGame = (socket, setGame) => {
	console.log("Listening to incoming game");
	socket.on('nextGame', (nextGame) => {
		console.log("Next incoming game");
		setGame(nextGame);
	});
}
