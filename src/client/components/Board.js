import React, { useState, useEffect } from 'react';
import {getPieceColor, getPieceShape} from './Piece';
import '../style/board.css';
import {askNewPiece} from '../api/socket.api'

const directions = ['up', 'right', 'down', 'left'];
const colorBg = '#3565d0';

const Board = ({isActive, setIsActive}) => {
    const initGrid = () => {
        const rows = [];
        for (let row = 0; row < 20; row++) {
            const cells = [];
            for (let col = 0; col < 10; col++) {
                cells.push({
                    color: colorBg,
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
    const [pieceDirection, setPieceDirection] = useState('up');
    const [indexDirection, setIndexDirection] = useState(1);
    const [pieceShape, setPieceShape] = useState(getPieceShape('', pieceDirection));
    const [getNewPiece, setGetNewPiece] = useState(true);

    const handleRotation = (gap, gridRow, gridCol) => {
        if (gridRow >= 20) {
            gap[0]--;
        }
        if (gridCol >= 10) {
            gridCol -= 4;
        } else if (gridCol < 0) {
            gridCol += 4;
        }
    };

    const insertColor = (newGrid, row, col) => {
        let gridRow, gridCol;
        let rowOverflow = 0, colOverflow = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (pieceShape[i][j] !== colorBg) {
                    gridRow = row + i;
                    gridCol = col + j;
                    if (gridRow >= 20) {
                        rowOverflow = Math.max(rowOverflow, gridRow - 19);
                        gridRow -= Math.min(rowOverflow, gridRow - 19);
                    }
                    if (gridCol >= 10) {
                        colOverflow = Math.max(colOverflow, gridCol - 9);
                        gridCol -= Math.min(colOverflow, gridCol - 9);
                    } else if (gridCol < 0) {
                        colOverflow = Math.min(colOverflow, gridCol);
                    }
                    //console.log("heeeeeeeere " + gridCol+ ' '+ colOverflow)
                    newGrid[gridRow - rowOverflow][gridCol - colOverflow] = { color: pieceShape[i][j], fixed: false };
                }
            }
        }
        setPiecePosition([row - rowOverflow, col - colOverflow]);
    };

    // const insertColor = (newGrid, row, col) => {
    //     let gridRow;
    //     let gridCol;
    //     let gap = [0, 0]; // gap of [row, col] the Piece overflows when rotating and have to be shifted of
    //     for (let i = 0; i < 4; i++) {
    //         for (let j = 0; j < 4; j++) {
    //             if (pieceShape[i][j] !== colorBg) {
    //                 gridRow = row + i;
    //                 gridCol = col + j;
    //                 //handleRotation(gap, gridRow, gridCol);
    //                 if (gridRow >= 20) {
    //                     gridRow -= 4;
    //                     setPiecePosition([gridRow, gridCol]);
    //                 }
    //                 if (gridCol >= 10) {
    //                     gridCol -= (10 - );
    //                     setPiecePosition([gridRow, gridCol]);
    //                 } else if (gridCol < 0) {
    //                     gridCol += 4;
    //                     setPiecePosition([gridRow, gridCol]);
    //                 }
    //                 newGrid[gridRow][gridCol] = { color: pieceShape[i][j], fixed: false };
    //
    //                 {
    //
    //                 // handle overflow when turning stuck on borders left/right
    //                 // !! prendre en compte le gap entre la bordure et le nb de cellules de la piece
    //                 //  qui feraient un overflow (pas tjs 4...)
    //                 // if (gridRow >= 20) {
    //                 //     gridRow -= 4;
    //                 //     setPiecePosition([gridRow, gridCol]);
    //                 // }
    //                 // if (gridCol >= 10) {
    //                 //     gridCol -= 4;
    //                 //     setPiecePosition([gridRow, gridCol]);
    //                 // } else if (gridCol < 0) {
    //                 //     gridCol += 4;
    //                 //     setPiecePosition([gridRow, gridCol]);
    //                 // }
    //                 }
    //             }
    //         }
    //     }
    //     setPiecePosition([row + gap[0], col + gap[1]]);
    // };

    const insertNewPiece = (pieceLetter, direction, row, col) => {
        const newGrid = [...grid];
        setPieceShape(getPieceShape(pieceLetter, direction));
        checkGameOver();
        insertColor(newGrid, row, col);
        //setPiecePosition([row, col]);
        setGrid(newGrid);
    };

    const insertPiece = (pieceShape, direction, row, col) => {
        const newGrid = [...grid];
        insertColor(newGrid, row, col);
        //setPiecePosition([row, col]);
        setGrid(newGrid);
    };

    const cleanGrid = (grid, row, col) => {
        //console.log(piecePosition)
        // clean la zone de la piece sur la grid,
        // !! bien check par la suite les couleurs car on peut avoir d'autres pieces sur le spectre
        // et aussi check les overflows
        for (let rowGrid = row; rowGrid < row + 4; rowGrid++) {
            for (let colGrid = col; colGrid < col + 4; colGrid++) {
                if (rowGrid >= 0 && colGrid >= 0 && rowGrid <= 19 && colGrid <= 9) {
                    if (grid[rowGrid][colGrid].fixed !== true) {
                        grid[rowGrid][colGrid] = {color: colorBg, fixed: false};
                    }
                }
            }
        }
    };

    /* get the most left, right or bottom cell of a Piece
    *  if it's left or right, a number representing a column will be returned
    *  if it's down, it'll be a row */
    const getBoundaryCellFromDirection = (pieceDirection, pieceShape, row, col) => {
        let boundary;
        //console.log(pieceShape);
        switch (pieceDirection) {
            case 'down':
                for (let rowPiece = 0; rowPiece < 4; rowPiece++) {
                    for (let colPiece = 0; colPiece < 4; colPiece++) {
                        if (pieceShape[rowPiece][colPiece] !== colorBg) {
                            boundary = rowPiece + row;
                        }
                    }
                }
                return boundary;
            case 'left':
                for (let rowPiece = 3; rowPiece >= 0; rowPiece--) {
                    for (let colPiece = 3; colPiece >= 0; colPiece--) {
                        if (pieceShape[rowPiece][colPiece] !== colorBg) {
                            boundary = colPiece + col;
                        }
                    }
                }
                return boundary;
            case 'right':
                for (let rowPiece = 0; rowPiece < 4; rowPiece++) {
                    for (let colPiece = 0; colPiece < 4; colPiece++) {
                        if (pieceShape[rowPiece][colPiece] !== colorBg) {
                            boundary = colPiece + col;
                        }
                    }
                }
                return boundary;
        }
    };

    const setFixed = (pieceShape, row, col) => {
        for (let rowPiece = 0; rowPiece < 4; rowPiece++) {
            for (let colPiece = 0; colPiece < 4; colPiece++) {
                if (pieceShape[rowPiece][colPiece] !== colorBg) {
                    grid[row + rowPiece][col + colPiece] = { color : pieceShape[rowPiece][colPiece], fixed: true };
                }
            }
        }
        removeFullLines();
        setGetNewPiece(true);
    };

    const checkFixed = (newPosition, pieceShape) => {
        for (let rowPiece = 0; rowPiece < 4; rowPiece++) {
            for (let colPiece = 0; colPiece < 4; colPiece++) {
                if (pieceShape[rowPiece][colPiece] !== colorBg) {
                    const row = rowPiece + newPosition[0];
                    const col = colPiece + newPosition[1];
                    if (row < 20 && col < 10 && grid[row][col].fixed) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const canMove = (pos, pieceShape, row, col) => {
        const boundary = getBoundaryCellFromDirection(pos, pieceShape, row, col);
        // console.log("Boundary = " + boundary)
        // next step : add collisions between pieces
        if (pos === 'down' && boundary < 20 && checkFixed([row, col], pieceShape)) {
            return true;
        } else if (pos === 'left' && boundary >= 0 && checkFixed([row, col], pieceShape)) {
            return true;
        } else if (pos === 'right' && boundary < 10 && checkFixed([row, col], pieceShape)) {
            return true;
        } else {
            return false;
        }
    };

    const removeFullLines = () => {
        let newGrid = [...grid];
        for (let row = 0; row < 20; row++) {
            if (!newGrid[row].some(cell => cell.color === colorBg && cell.fixed === false)) {
                newGrid.splice(row, 1);
                newGrid.unshift(Array(10).fill({color: colorBg, fixed: false}));
            }
        }
        setGrid(newGrid);
    };

    const checkGameOver = () => {
        if (pieceShape !== undefined) {
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (pieceShape[row][col] !== colorBg && grid[row][col + 3].fixed) {
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
            insertNewPiece(pieceLetter, pieceDirection, 0, 3); // penser a modifier pieceDirection en prod ?
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
            }, 500);
            return () => clearInterval(interval);
        }
    });

    // gameloop
    useEffect(() => {
        if (isActive && getNewPiece) {
            // const pieces = ['I', 'J', 'L', 'S', 'Z', 'T', 'O'];
            // const randomIndex = Math.floor(Math.random() * pieces.length);
            setPieceLetter('I');
            setPieceType('I');
            setGetNewPiece(false);
        }
    }, [isActive, getNewPiece]);

    /* handle KeyEvents => movePiece */
    useEffect(() => {
        const handleKeyDown = (event) => {
            const newGrid = [...grid];
            const [row, col] = piecePosition;

            if (event.key === 'ArrowDown' && canMove('down', pieceShape,row + 1, col)) {
                cleanGrid(newGrid, row, col);
                insertPiece(pieceShape, pieceDirection, row + 1, col);
            } else if (event.key === 'ArrowLeft' && canMove('left', pieceShape, row, col - 1)) {
                cleanGrid(newGrid, row, col);
                insertPiece(pieceShape, pieceDirection, row, col - 1);
            } else if (event.key === 'ArrowRight' && canMove('right', pieceShape, row, col + 1)) {
                cleanGrid(newGrid, row, col);
                insertPiece(pieceShape, pieceDirection, row, col + 1);
            } else if (event.key === 'ArrowUp') {
                cleanGrid(newGrid, row, col);
                setIndexDirection(indexDirection + 1);
                setPieceDirection(directions[indexDirection % 4]);
            }
            setGrid(newGrid);
        };
        if (isActive) {
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    });

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
