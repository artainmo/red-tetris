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
** Each player should be able to see other players' games.
** Thus each player needs to send his game to other players.
** This function allows a player to send his game to the other players of the room/game.
** The gameStructure paramater should look like this for example:
{
  player: 'Philip',
  structure: [ [ 'I', 'BG', 'BG' ], [ 'BG', 'BG', 'BG' ], [ 'BG', 'T', 'BG' ] ]
}
** The structure of the game is represented in a double array with BG indicating
** background and other letters indicating a tetrimono type.
*/
export const sendPersonalGameStructure = (socket, roomId, gameStructure) => {
  	socket.emit('sendPersonalGameStructure',
      	{roomId: roomId, gameStructure: gameStructure});
}
/*
** Does not return.
*/

/*
** This function receives the gameStructure that got sent by other players
** in the room with sendPersonalGameStructure.
*/
export const listenOtherPlayerGameStructure = (socket, setOtherPlayerGameStructure) => {
  	socket.on('otherPlayerGameStructure', (data) => {
    	setOtherPlayerGameStructure(data);
  	});
}
/*
** Does not explicitly return.
** However, takes 'setOtherPlayerGameStructure' which is supposed to come from:
** 'const [otherPlayerGameStructure, setOtherPlayerGameStructure] = useState(null);'.
** Thus the new game structure send by socket should be found in 'otherPlayerGameStructure'.
** The otherPlayerGameStructure object looks like this for example:
{
  player: 'Philip',
  structure: [ [ 'I', 'BG', 'BG' ], [ 'BG', 'BG', 'BG' ], [ 'BG', 'T', 'BG' ] ]
}
*/

/*
** After a game finishes the host of the game should ask for a new game via HTTP request.
** Once he has the new game he can send it via the sockets to other players in the same room.
** This function sends the next game to other players of the room via sockets.
** The nextGame object is expected to look similar to what the HTTP requests return:
{
  _id: '69c2c703-ad74-456a-9856-7ec767b2b0df',
  _player1: 'Alfred',
  _player2: 'Conrad',
  _player3: 'Philip',
  _player4: null,
  _player5: null,
  _player6: null,
  _player1_score: null,
  _player2_score: null,
  _player3_score: null,
  _player4_score: null,
  _player5_score: null,
  _player6_score: null
}
*/
export const sendNextGame = (socket, roomId, nextGame) => {
  	socket.emit('sendNextGame', {roomId: roomId, nextGame: nextGame});
}
/*
** Does not return.
*/

/*
** This function receives the next game that got sent by host via sendNextGame.
** Players other than the host who are in same room should receive it.
*/
export const listenNextGame = (socket, setGame) => {
	//console.log("Listening to incoming game");
	socket.on('nextGame', (nextGame) => {
		//console.log("Next incoming game");
		setGame(nextGame);
	});
}

