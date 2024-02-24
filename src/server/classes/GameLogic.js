
class GameLogic {
	
	constructor(rows = 20, cols = 10) {
		this.rows = rows;
    	this.cols = cols;
    	this.grid = this.createEmptyGrid();
	};

	createEmptyGrid() {
		const grid = new Array(this.rows);
		for (let row = 0; row < this.rows; row++) {
			grid[row] = new Array(this.cols).fill('BG');
		}
		return grid;
	}

	/* take an input from the player (wasd key) and decide if 
	rotation is possible on the matrix representing the board */
	canPieceRotate(direction) {
		// TODO
		return true;
	}

	/* when the lower line is full (no cell is empty), then it will remove the line */
	clearLine() {

	}

	/* should put the new piece into the board when relevant (fetch it from the Piece object) */
	addNewPiece() {
		const newPiece = Piece();
	}

	/* DEBUG ONLY */
	
	/* used to display the grid to debug purposes */
	showGrid() {

	}
}
