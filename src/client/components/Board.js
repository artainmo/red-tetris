import React, { useState, useEffect } from 'react';
import { getPieceShape, getBoundaryCellFromDirection } from './Piece';
import '../style/board.css';

const DIRECTIONS = ['up', 'right', 'down', 'left'];
const GRID_LENGTH = 20;
const GRID_WIDTH = 10;
const PIECE_LENGTH = 4;
const PIECE_WIDTH = 4;
const COLOR_BG = '#3565d0';
const GRAVITY_MS = 500; /* interval to make the tetromino falling down, in milliseconds */

const Board = ({isActive, setIsActive}) =>
{
    const initGrid = () => {
        const rows = [];

        for (let row = 0; row < GRID_LENGTH; row++) {
            const cells = [];
            for (let col = 0; col < GRID_WIDTH; col++) {
                cells.push({
                    color: COLOR_BG,
                    fixed: false,
                });
            }
            rows.push(cells);
        }
        return rows;
    };

    const [grid, setGrid] = useState(initGrid());
    const [pieceLetter, setPieceLetter] = useState('');
    const [pieceType, setPieceType] = useState('');
    const [piecePosition, setPiecePosition] = useState([]);
    const [pieceDirection, setPieceDirection] = useState('');
    const [indexDirection, setIndexDirection] = useState(1);
    const [pieceShape, setPieceShape] = useState(getPieceShape('', pieceDirection));
    const [getNewPiece, setGetNewPiece] = useState(true);

    const canRotate = (pieceShape, direction, row, col) => {
        /* simulate the shape after rotating */
        //console.log(row, col)
        const piece_tmp = getPieceShape(pieceType, DIRECTIONS[(indexDirection + 1) % 4]);
        for (let i = 0; i < PIECE_LENGTH; i++) {
            for (let j = 0; j < PIECE_WIDTH; j++) {
                const gridRow = row + i;
                const gridCol = col + j;
                //console.log(piece_tmp[i][j], grid[gridRow][gridCol].fixed, gridRow, gridCol)
                if (piece_tmp[i][j] !== COLOR_BG
                    && gridRow >= 0 && gridCol >= 0
                    && gridRow <= GRID_LENGTH
                    && gridCol <= GRID_WIDTH
                    && grid[gridRow][gridCol].fixed) {
                    console.log('---------cannot rotate---------')
                    return false;
                }
            }
        }
        return true;
    };

    const insertPiece = (pieceShape, direction, row, col) => {
        const newGrid = [...grid];
        let gridRow, gridCol;
        let rowOverflow = 0, colOverflow = 0;

        for (let i = 0; i < PIECE_LENGTH; i++) {
            for (let j = 0; j < PIECE_WIDTH; j++) {
                if (pieceShape[i][j] !== COLOR_BG) {
                    gridRow = row + i;
                    gridCol = col + j;
                    /* handleOverflow when rotating, we need to get the gap between the border
                    * of the grid and the cells that are overflowing to then shift the Piece */
                    if (gridRow >= GRID_LENGTH) {
                        rowOverflow = Math.max(rowOverflow, gridRow - (GRID_LENGTH - 1));
                        gridRow -= Math.min(rowOverflow, gridRow - (GRID_LENGTH - 1));
                    }
                    if (gridCol >= GRID_WIDTH) {
                        colOverflow = Math.max(colOverflow, gridCol - (GRID_WIDTH - 1));
                        gridCol -= Math.min(colOverflow, gridCol - (GRID_WIDTH - 1));
                    } else if (gridCol < 0) {
                        colOverflow = Math.min(colOverflow, gridCol);
                    }
                    newGrid[gridRow - rowOverflow][gridCol - colOverflow] = { color: pieceShape[i][j], fixed: false };
                }
            }
        }
        setPiecePosition([row - rowOverflow, col - colOverflow]);
        setGrid(newGrid);
    };

    const cleanGrid = (grid, row, col) => {
        for (let rowGrid = row; rowGrid < row + PIECE_LENGTH; rowGrid++) {
            for (let colGrid = col; colGrid < col + PIECE_WIDTH; colGrid++) {
                if (rowGrid >= 0 && colGrid >= 0 && rowGrid <= GRID_LENGTH - 1 && colGrid <= GRID_WIDTH - 1) {
                    if (grid[rowGrid][colGrid].fixed !== true) {
                        grid[rowGrid][colGrid] = {color: COLOR_BG, fixed: false};
                    }
                }
            }
        }
    };

    const setFixed = (pieceShape, row, col) => {
        for (let rowPiece = 0; rowPiece < PIECE_LENGTH; rowPiece++) {
            for (let colPiece = 0; colPiece < PIECE_WIDTH; colPiece++) {
                if (pieceShape[rowPiece][colPiece] !== COLOR_BG) {
                    grid[row + rowPiece][col + colPiece] = { color : pieceShape[rowPiece][colPiece], fixed: true };
                }
            }
        }
        removeFullLines();
        setGetNewPiece(true);
    };

    const checkFixed = (newPosition, pieceShape) => {
        for (let rowPiece = 0; rowPiece < PIECE_LENGTH; rowPiece++) {
            for (let colPiece = 0; colPiece < PIECE_WIDTH; colPiece++) {
                if (pieceShape[rowPiece][colPiece] !== COLOR_BG) {
                    const row = rowPiece + newPosition[0];
                    const col = colPiece + newPosition[1];
                    if (row < GRID_LENGTH && col < GRID_WIDTH && grid[row][col].fixed) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const canMove = (pos, pieceShape, row, col) => {
        const boundary = getBoundaryCellFromDirection(pos, pieceShape, row, col);

        if (pos === 'down' && boundary < GRID_LENGTH && checkFixed([row, col], pieceShape)) {
            return true;
        } else if (pos === 'left' && boundary >= 0 && checkFixed([row, col], pieceShape)) {
            return true;
        } else if (pos === 'right' && boundary < GRID_WIDTH && checkFixed([row, col], pieceShape)) {
            return true;
        } else {
            return false;
        }
    };

    const handleKeyDown = (event) => {
        const newGrid = [...grid];
        const [row, col] = piecePosition;

        event.preventDefault();
        if (event.key === 'ArrowDown' && canMove('down', pieceShape,row + 1, col)) {
            cleanGrid(newGrid, row, col);
            insertPiece(pieceShape, pieceDirection, row + 1, col);
        } else if (event.key === 'ArrowDown') {
            setFixed(pieceShape, row, col);
        } else if (event.key === 'ArrowLeft' && canMove('left', pieceShape, row, col - 1)) {
            cleanGrid(newGrid, row, col);
            insertPiece(pieceShape, pieceDirection, row, col - 1);
        } else if (event.key === 'ArrowRight' && canMove('right', pieceShape, row, col + 1)) {
            cleanGrid(newGrid, row, col);
            insertPiece(pieceShape, pieceDirection, row, col + 1);
        } else if (event.key === 'ArrowUp' && canRotate(pieceShape, pieceDirection, row, col)) {
            cleanGrid(newGrid, row, col);
            setIndexDirection(indexDirection + 1);
            setPieceDirection(DIRECTIONS[indexDirection % 4]);
        }
        setGrid(newGrid);
    };

    const removeFullLines = () => {
        let newGrid = [...grid];

        for (let row = 0; row < GRID_LENGTH; row++) {
            if (!newGrid[row].some(cell => cell.color === COLOR_BG && cell.fixed === false)) {
                newGrid.splice(row, 1);
                newGrid.unshift(Array(GRID_WIDTH).fill({color: COLOR_BG, fixed: false}));
            }
        }
        setGrid(newGrid);
    };

    const checkGameOver = () => {
        if (pieceShape !== undefined) {
            for (let row = 0; row < PIECE_LENGTH; row++) {
                for (let col = 0; col < PIECE_WIDTH; col++) {
                    if (pieceShape[row][col] !== COLOR_BG && grid[row][col + 3].fixed) {
                        console.log("game over !")
                        setIsActive(false);
                    }
                }
            }
        }
    };

    /* inserting a new Piece */
    useEffect(() => {
        if (pieceLetter !== '') {
            console.log("inserting a new Piece " + pieceLetter);
            setPieceShape(getPieceShape(pieceLetter, pieceDirection));
            checkGameOver();
            setPieceLetter('');
        }
    }, [pieceLetter]);

    /* changing direction of Piece */
    useEffect(() => {
        if (piecePosition[0] !== undefined && piecePosition[1] !== undefined) {
            console.log("changing direction to " + pieceDirection);
            setPieceShape(getPieceShape(pieceType, pieceDirection));
        }
    }, [pieceDirection]);

    /* changing shape of Piece (after changing the direction) */
    useEffect(() => {
        if (piecePosition[0] !== undefined && piecePosition[1] !== undefined) {
            console.log("updating shape...");
            insertPiece(pieceShape, pieceDirection, piecePosition[0], piecePosition[1]);
        }
    }, [pieceShape]);

    /* piece gravity that takes effect every second */
    useEffect(() => {
        if (isActive && !getNewPiece) {
            console.log("useEffect running");
            const newGrid = [...grid];
            const [row, col] = piecePosition;
            const interval = setInterval(() => {
                if (canMove('down', pieceShape,row + 1, col)) {
                    cleanGrid(newGrid, row, col);
                    insertPiece(pieceShape, pieceDirection, row + 1, col);
                } else {
                    setFixed(pieceShape, row, col);
                }
            }, GRAVITY_MS);
            return () => clearInterval(interval);
        }
    });

    /* handle KeyEvents => movePiece */
    useEffect(() => {
        if (isActive) {
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    });

    /* askNewPiece */
    useEffect(() => {
        if (isActive && getNewPiece) {
            // const pieces = ['I', 'J', 'L', 'S', 'Z', 'T', 'O'];
            // const randomIndex = Math.floor(Math.random() * pieces.length);
            setPieceLetter('I');
            setPieceType('I');
            setPieceDirection('up');
            setIndexDirection(1);
            setPiecePosition([0, 3]);
            setGetNewPiece(false);
        }
    }, [isActive, getNewPiece]);

    return (
      <div className="board-wrapper">
          <div className="board">
              {grid.map((row, rowIndex) => {
                  return (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => (
                          <div key={`${rowIndex}${cellIndex}`} className="cell" style={{ backgroundColor: cell.color }} />
                        ))}
                    </div>
                  );
              })}
          </div>
      </div>
    );
};

export default Board;
