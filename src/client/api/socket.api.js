import { API_ENDPOINT } from "./api_endpoint"
import { io } from "socket.io-client";

/*
** Use this function to connect to the socket.
*/
/*
** Does not return.
*/

/*
** Each room represents a game.
** All players of same game must connect to same room.
** Thus the roomId should be 'game._id'.
** This roomId will be used later on for other socket manipulations within the room.
*/
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
// export const listenNewPiece = (socket, setNewPiece) => {
// 	//console.log("Listening to incoming piece");
// 	socket.on('nextPiece', (data) => {
// 		//console.log("New incoming piece");
// 		setNewPiece(data);
// 	});
// }
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
	** Thus each player needs to send their game to other players.
	** This function allows a player to send their game to the other players of the room/game.
** The gameStructure parameter should look like this for example:
{
	player: 'Philip',
	structure: [ [ 'I', 'BG', 'BG' ], [ 'BG', 'BG', 'BG' ], [ 'BG', 'T', 'BG' ] ]
	}
	** The structure of the game is represented in a double array with BG indicating
	** background and other letters indicating a tetrimono type.
	*/
	/*
	** Does not return.
	*/
	
	/*
	** This function receives the structure that got sent by other players
	** in the room with updateScreen.
	*/

export const connect = (token) => {
	console.log("Connecting to socket with token:", token);
	const socket = io(API_ENDPOINT, {
		auth: { token },
		autoConnect: true,
	});
	return socket;
};

export const disconnect = (socket) => {
	if (socket) socket.disconnect();
};

export const joinRoom = async (username, socket, roomId) => {
	console.log("joining room with roomId " + roomId);
	console.log("joiner is " + username);
	return new Promise((resolve, reject) => {
        socket.emit('joinRoom', { username: username, roomId: roomId }, (response) => {
            if (response.success) {
                resolve(response.data);
            } else {
                reject(new Error(response.error || "Unknown socket error"));
            }
        });
    });
	// socket.emit('joinRoom', { username: username, roomId: roomId });
}

export const listenRoomJoined = (socket, onRoomJoined) => {
  	socket.on('roomJoined', (data) => {
		onRoomJoined(data.roomId, data.players);
  	});
}

export const startGame = (socket, roomId) => {
	console.log("starting game with roomId " + roomId);
		socket.emit('startGame', roomId);
}

export const updateScreenAndScore = (socket, structure, score) => {
	socket.emit('updateScreenAndScore',
		{structure: structure, score: score});
}

export const listenOtherScreenAndScore = (socket, onScreenAndScoreUpdate) => {
  	socket.on('screenAndScoreUpdate', (data) => {
		onScreenAndScoreUpdate(data);
	});
}

export const sendLinesCleared = (socket, linesCleared) => {
  	socket.emit('linesCleared',
	  	{linesCleared: linesCleared});
}

export const listenLinesCleared = (socket, onLinesCleared) => {
  	socket.on('linesCleared', (data) => {
		onLinesCleared(data.player, data.linesCleared);
  	});
}

export const listenStartGame = (socket, onGameStarted) => {
  	socket.on('startGame', () => {
		console.log("Received gameStarted event from socket");
		onGameStarted();
  	});
}

export const listenNextPiece = (socket, onNextPiece) => {
  	socket.on('nextPiece', (data) => {
		onNextPiece(data);
  	});
}

export const requestPieceBasket = (socket) => {
  	socket.emit('needPieceBasket');
}

export const leaveRoom = (socket) => {
	console.log("Leaving room");
  	socket.emit('leaveRoom');
}

export const listenPlayerLeft = (socket, onPlayerLeft) => {
  	socket.on('playerLeft', (data) => {
		onPlayerLeft(data.player);
  	});
}

export const listenNewHost = (socket, onNewHost) => {
  	socket.on('newHost', (data) => {
		onNewHost(data.newHost);
  	});
}

export const listenPlayerJoined = (socket, onPlayerJoined) => {
  	socket.on('playerJoined', (data) => {
		onPlayerJoined(data.player);
  	});
}

export const updateScore = (socket, onScoreUpdate) => {
  	socket.on('updateScore', (data) => {
		onScoreUpdate(data);
  	});
}

export const looseGame = (socket) => {
  	socket.emit('looseGame');
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

