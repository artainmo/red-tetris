import React, { useState, useEffect } from 'react';
import {getPieceColor, getPieceShape} from './Piece';
import '../style/board.css';

const directions = ['up', 'right', 'down', 'left'];
const colorBg = '#3565d0';

const Board = ({pieceLetter}) => {
    const initGrid = () => {
        const rows = [];
        for (let row = 0; row < 20; row++) {
            const cells = [];
            for (let col = 0; col < 10; col++) {
                cells.push({
                    color: colorBg
                });
            }
            rows.push(cells);
        }
        return rows;
    };

    const [grid, setGrid] = useState(initGrid());
    const [piecePosition, setPiecePosition] = useState([]);
    const [pieceDirection, setPieceDirection] = useState('up');
    const [indexDirection, setIndexDirection] = useState(1);
    const [pieceShape, setPieceShape] = useState(getPieceShape(pieceLetter, pieceDirection));

    const insertColor = (newGrid, row, col) => {
        let gridRow;
        let gridCol;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (pieceShape[i][j] !== colorBg) {
                    gridRow = row + i;
                    gridCol = col + j;
                    // handle overflow when turning stuck on borders left/right
                    if (gridRow >= 20) {
                        gridRow -= 4;
                        setPiecePosition([gridRow, gridCol]);
                    }
                    if (gridCol >= 10) {
                        gridCol -= 4;
                        setPiecePosition([gridRow, gridCol]);
                    } else if (gridCol < 0) {
                        setPiecePosition([gridRow, gridCol]);
                        gridCol += 4;
                    }
                    newGrid[gridRow][gridCol] = { color: pieceShape[i][j] };
                }
            }
        }
    };

    const insertNewPiece = (pieceLetter, direction, row, col) => {
        const newGrid = [...grid];
        setPieceShape(getPieceShape(pieceLetter, direction));
        insertColor(newGrid, row, col);
        setPiecePosition([row, col]);
        setGrid(newGrid);
    };

    const insertPiece = (pieceShape, direction, row, col) => {
        const newGrid = [...grid];
        insertColor(newGrid, row, col);
        setPiecePosition([row, col]);
        setGrid(newGrid);
    };

    const cleanGrid = (grid, row, col) => {
        console.log(row, col)
        // clean la zone de la piece sur la grid,
        // !! bien check par la suite les couleurs car on peut avoir d'autres pieces sur le spectre
        // et aussi check les overflows
        for (let rowGrid = row; rowGrid < row + 4; rowGrid++) {
            for (let colGrid = col; colGrid < col + 4; colGrid++) {
                if (rowGrid >= 0 && colGrid >= 0 && rowGrid <= 19 && colGrid <= 9) {
                    grid[rowGrid][colGrid].color = colorBg;
                }
            }
        }
    };

    /* get the most left, right or bottom cell of a Piece
    *  if it's left or right, a number representing a column will be returned
    *  if it's down, it'll be a row */
    const getBoundaryCellFromDirection = (pieceDirection, pieceShape, row, col) => {
        let boundary = -1;
            console.log(pieceShape);
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

    const canMove = (pos, pieceShape, row, col) => {
        const boundary = getBoundaryCellFromDirection(pos, pieceShape, row, col);
        console.log("Boundary = " + boundary)
        // next step : add collisions between pieces
        if (pos === 'down' && boundary < 20) {
            return true;
        } else if (pos === 'left' && boundary >= 0) {
            return true;
        } else if (pos === 'right' && boundary < 10) {
            return true;
        } else {
            return false;
        }
    };

    /* inserting a new Piece */
    useEffect(() => {
        console.log("inserting a new Piece " + pieceLetter);
        insertNewPiece(pieceLetter, pieceDirection, 0, 3); // penser a modifier pieceDirection en prod ?
    }, [pieceLetter]);

    /* changing direction of Piece */
    useEffect(() => {
        console.log("changing direction to " + pieceDirection);
        if (piecePosition[0] !== undefined && piecePosition[1] !== undefined) {
            setPieceShape(getPieceShape(pieceLetter, pieceDirection));
        }
    }, [pieceDirection]);

    /* changing shape of Piece (after changing the direction) */
    useEffect(() => {
        console.log("updating shape...");
        if (piecePosition[0] !== undefined && piecePosition[1] !== undefined) {
            insertPiece(pieceShape, pieceDirection, piecePosition[0], piecePosition[1]);
        }
    }, [pieceShape]);

    /* changing position of Piece (when stuck to the border and changing the direction) */
    useEffect(() => {
    }, [piecePosition]);

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

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
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
