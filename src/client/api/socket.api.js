import { API_ENDPOINT } from './api_endpoint'
import { io } from 'socket.io-client'

export const askNewPiece = (socket, roomId) => {
	socket.emit('askNewPiece', roomId)
}

export const connect = (token) => {
	console.log('Connecting to socket with token:', token)
	const socket = io(API_ENDPOINT, {
		auth: { token },
		autoConnect: true,
	})
	return socket
}

export const disconnect = (socket) => {
	if (socket) {
		socket.disconnect()
	}
}

export const joinRoom = async (username, socket, roomId) => {
	console.log('joining room with roomId ' + roomId)
	console.log('joiner is ' + username)
	return new Promise((resolve, reject) => {
		socket.emit(
			'joinRoom',
			{ username: username, roomId: roomId },
			(response) => {
				if (response.success) {
					resolve(response.data)
				} else {
					reject(new Error(response.error || 'Unknown socket error'))
				}
			}
		)
	})
}

export const listenRoomJoined = (socket, onRoomJoined) => {
	socket.on('roomJoined', (data) => {
		onRoomJoined(data.roomId, data.players)
	})
}

export const startGame = (socket, roomId) => {
	console.log('starting game with roomId ' + roomId)
	socket.emit('startGame', roomId)
}

export const updateScreenAndScore = (socket, structure, score) => {
	socket.emit('updateScreenAndScore', { structure: structure, score: score })
}

export const listenOtherScreenAndScore = (socket, onScreenAndScoreUpdate) => {
	socket.on('screenAndScoreUpdate', (data) => {
		onScreenAndScoreUpdate(data)
	})
}

export const sendLinesCleared = (socket, linesCleared) => {
	socket.emit('linesCleared', { linesCleared: linesCleared })
}

export const listenLinesCleared = (socket, onLinesCleared) => {
	socket.on('linesCleared', (data) => {
		onLinesCleared(data.player, data.linesCleared)
	})
}

export const listenStartGame = (socket, onGameStarted) => {
	socket.on('startGame', (data) => {
		console.log('Received gameStarted event from socket')
		onGameStarted(data)
	})
}

export const listenNextPiece = (socket, onNextPiece) => {
	socket.on('nextPiece', (data) => {
		onNextPiece(data)
	})
}

export const requestPieceBasket = (socket) => {
	socket.emit('needPieceBasket')
}

export const leaveRoom = (socket) => {
	console.log('Leaving room')
	//Resolves once the server acks that 'leaveRoom' (and the DB write it can trigger when the room
	//becomes empty) has finished, so callers can wait for it before trusting freshly-fetched scores.
	return new Promise((resolve) => {
		socket.emit('leaveRoom', () => resolve())
	})
}

export const listenPlayerLeft = (socket, onPlayerLeft) => {
	socket.on('playerLeft', (data) => {
		onPlayerLeft(data.player)
	})
}

export const listenNewHost = (socket, onNewHost) => {
	socket.on('newHost', (data) => {
		onNewHost(data.newHost)
	})
}

export const listenPlayerJoined = (socket, onPlayerJoined) => {
	socket.on('playerJoined', (data) => {
		onPlayerJoined(data.player)
	})
}

export const updateScore = (socket, onScoreUpdate) => {
	socket.on('updateScore', (data) => {
		onScoreUpdate(data)
	})
}

export const looseGame = (socket) => {
	socket.emit('looseGame')
}

export const sendNextGame = (socket, roomId, nextGame) => {
	socket.emit('sendNextGame', { roomId: roomId, nextGame: nextGame })
}

export const listenNextGame = (socket, setGame) => {
	socket.on('nextGame', (nextGame) => {
		setGame(nextGame)
	})
}
