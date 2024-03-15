import { API_ENDPOINT } from "./api_endpoint"
import { io } from "socket.io-client";

/*
** Use this function to connect to the socket.
*/
export const connect = () => {
  	return io(API_ENDPOINT);
}
/*
** Returns a socket object that can be used later on for other socket manipulations.
*/

/*
** Disconnects from socket and thus leaves associated room.
*/
export const disconnect = (socket) => {
  	socket.disconnect();
}
/*
** Does not return.
*/

/*
** Each room represents a game.
** All players of same game must connect to same room.
** Thus the roomId should be 'game._id'.
** This roomId will be used later on for other socket manipulations within the room.
*/
export const joinRoom = (socket, roomId) => {
  	socket.emit("joinRoom", roomId);
}
/*
** Does not return.
*/

/*
** One player of the room, the host, thus _player1, should ask for a new piece on
** each tetris turn. This new piece is sent to all room/game members.
*/
export const askNewPiece = (socket, roomId) => {
  	socket.emit('askNewPiece', roomId);
}
/*
** Does not return.
*/

/*
** All players of a game who are part of a room should listen for new pieces.
** The room host will ask for a new piece with 'askNewPiece' function to the socket.
** And 'listenNewPiece' will receive the socket's response.
*/
export const listenNewPiece = (socket, setNewPiece) => {
  	//console.log("Listening to incoming piece");
  	socket.on('newPiece', (data) => {
		   //console.log("New incoming piece");
		  setNewPiece(data);
  	});
}
/*
** Does not explicitly return.
** However, takes 'setNewPiece' which is supposed to come from:
** 'const [newPiece, setNewPiece] = useState(null);'.
** Thus the new piece send by socket should be found in 'newPiece'.
** The newPiece object looks like this for example:
{
  _type: 'J'
}
*/


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
