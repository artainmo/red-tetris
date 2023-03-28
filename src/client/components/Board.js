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
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (pieceShape[i][j] !== colorBg) {
                    newGrid[row + i][col + j] = { color: pieceShape[i][j] };
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
        // clean la zone de la piece sur la grid,
        // !! bien check par la suite les couleurs car on peut avoir d'autres pieces sur le spectre
        // et aussi check les overflows
        for (let rowGrid = row; rowGrid < row + 4; rowGrid++) {
            for (let colGrid = col; colGrid < col + 4; colGrid++) {
                grid[rowGrid][colGrid].color = colorBg;
            }
        }
    }

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

    /* handle KeyEvents => movePiece */
    useEffect(() => {
        const handleKeyDown = (event) => {
            const newGrid = [...grid];
            const [row, col] = piecePosition;

            cleanGrid(newGrid, row, col);

            switch (event.key) {
                case 'ArrowDown':
                    insertPiece(pieceShape, pieceDirection, row + 1, col);
                    break;
                case 'ArrowLeft':
                    insertPiece(pieceShape, pieceDirection, row, col - 1);
                    break;
                case 'ArrowRight':
                    insertPiece(pieceShape, pieceDirection, row, col + 1);
                    break;
                case 'ArrowUp':
                    setIndexDirection(indexDirection + 1);
                    setPieceDirection(directions[indexDirection % 4]);
                    break;
                default:
                    break;
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
