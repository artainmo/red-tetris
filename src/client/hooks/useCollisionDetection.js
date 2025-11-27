import { useCallback } from 'react'

const useCollisionDetection = (width, height, grid) => {
	const isOutOfBound = (x, y) => {
		return x < 0 || x >= width || y >= height
	}

	const getGridWithoutCurrentPiece = (piece, x, y, orientation) => {
		const shapeCoords = piece[orientation]

		const currentGridWithoutPiece = grid.map((row) => [...row])
		shapeCoords.forEach(([relY, relX]) => {
			const currentX = x + relX
			const currentY = y + relY
			if (
				currentY >= 0 &&
				currentY < height &&
				currentX >= 0 &&
				currentX < width
			) {
				currentGridWithoutPiece[currentY][currentX] = 0
			}
		})

		return currentGridWithoutPiece
	}

	const checkCollision = (
		piece,
		x,
		y,
		orientation,
		gridWithoutCurrentPiece
	) => {
		const shapeCoords = piece[orientation]

		for (let [relY, relX] of shapeCoords) {
			const newX = x + relX
			const newY = y + relY
			if (
				isOutOfBound(newX, newY) ||
				gridWithoutCurrentPiece[newY][newX] !== 0
			) {
				return true
			}
		}
		return false
	}

	const canMoveDown = useCallback(
		(piece, x, y, orientation, nlines = 1) => {
			const gridWithoutCurrentPiece = getGridWithoutCurrentPiece(
				piece,
				x,
				y,
				orientation
			)
			return !checkCollision(
				piece,
				x,
				y + nlines,
				orientation,
				gridWithoutCurrentPiece
			)
		},
		[grid, width, height]
	)

	const canMoveLeft = useCallback(
		(piece, x, y, orientation) => {
			const gridWithoutCurrentPiece = getGridWithoutCurrentPiece(
				piece,
				x,
				y,
				orientation
			)

			return !checkCollision(
				piece,
				x - 1,
				y,
				orientation,
				gridWithoutCurrentPiece
			)
		},
		[grid, width, height]
	)

	const canMoveRight = useCallback(
		(piece, x, y, orientation) => {
			const gridWithoutCurrentPiece = getGridWithoutCurrentPiece(
				piece,
				x,
				y,
				orientation
			)

			return !checkCollision(
				piece,
				x + 1,
				y,
				orientation,
				gridWithoutCurrentPiece
			)
		},
		[grid, width, height]
	)

	const canRotate = useCallback(
		(piece, x, y, orientation, newOrientation) => {
			const gridWithoutCurrentPiece = getGridWithoutCurrentPiece(
				piece,
				x,
				y,
				orientation
			)

			return !checkCollision(
				piece,
				x,
				y,
				newOrientation,
				gridWithoutCurrentPiece
			)
		},
		[grid, width, height]
	)

	const canWallRotate = useCallback(
		(piece, x, y, orientation, newOrientation, offsetX) => {
			const gridWithoutCurrentPiece = getGridWithoutCurrentPiece(
				piece,
				x,
				y,
				orientation
			)

			return !checkCollision(
				piece,
				x + offsetX,
				y,
				newOrientation,
				gridWithoutCurrentPiece
			)
		},
		[grid, width, height]
	)

	return { canMoveDown, canMoveLeft, canMoveRight, canRotate, canWallRotate }
}

export default useCollisionDetection
