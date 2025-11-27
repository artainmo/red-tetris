import { createSlice } from '@reduxjs/toolkit'
import { askNewPiece, listenNextPiece } from '../../api/socket.api'
import { joinRoomThunk } from './roomSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TETROMINOS } from '../../utils/tetrominoes'

export const incrementIndex = () => (dispatch, getState) => {
	dispatch(pieceSlice.actions.incrementIndex())
	const { listPieces, index } = getState().piece
	console.log('Current piece index:', index)
	console.log('Total pieces available:', listPieces.length)
	if (index >= listPieces.length - 2) {
		askNewPiece(getState().socket.socket)
	}
}

export const useNextPieceListener = () => {
	const socket = useSelector((state) => state.socket?.socket)
	const dispatch = useDispatch()
	useEffect(() => {
		if (!socket) return

		const onNewPiece = (newPieces) => {
			console.log('Received new pieces from server:', newPieces)
			dispatch(pieceSlice.actions.addPieces(newPieces))
		}
		console.log('Setting up listener for nextPiece')
		listenNextPiece(socket, onNewPiece)
		return () => {
			if (socket && socket.off) socket.off('nextPiece')
		}
	}, [socket, dispatch])
}

const pieceSlice = createSlice({
	name: 'piece',
	initialState: {
		listPieces: [],
		nextPiece: '',
		currentPiece: '',
		tetrominosCurrentPiece: null,
		tetrominosNextPiece: null,
		index: 0,
	},
	reducers: {
		refresh: (state, action) => {
			state.index = 0
			state.listPieces = action.payload
			state.currentPiece = state.listPieces[state.index]
			state.tetrominosCurrentPiece = TETROMINOS[state.currentPiece]
			console.log('Refreshing pieces. Current piece:', state.currentPiece)
			console.log('tetrominosCurrentPiece:', state.tetrominosCurrentPiece)
			state.nextPiece = state.listPieces[state.index + 1]
			state.tetrominosNextPiece = TETROMINOS[state.nextPiece]
		},
		addPieces: (state, action) => {
			console.log(
				'Adding new pieces to the piece list:',
				action.payload.pieceBaskets
			)
			state.listPieces = state.listPieces.concat(action.payload.pieceBaskets)
		},
		incrementIndex: (state) => {
			state.index += 1
			state.currentPiece = state.listPieces[state.index]
			state.tetrominosCurrentPiece = TETROMINOS[state.currentPiece]
			console.log(
				'Incrementing piece index. Current piece:',
				state.currentPiece
			)
			console.log('tetrominosCurrentPiece:', state.tetrominosCurrentPiece)
			state.nextPiece = state.listPieces[state.index + 1]
			state.tetrominosNextPiece = TETROMINOS[state.nextPiece]
		},
		removeCurrentPiece: (state) => {
			state.currentPiece = ''
			state.tetrominosCurrentPiece = null
		},
	},
	extraReducers: (builder) => {
		builder.addCase(joinRoomThunk.fulfilled, (state, action) => {
			const game = action.payload.game
			state.listPieces = game.pieceBasket
			state.index = 0
			state.currentPiece = state.listPieces[0]
			state.tetrominosCurrentPiece = TETROMINOS[state.currentPiece]
			state.nextPiece = state.listPieces[1]
			state.tetrominosNextPiece = TETROMINOS[state.nextPiece]
		})
	},
})

export default pieceSlice
