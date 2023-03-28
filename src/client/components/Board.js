import React, { useState, useEffect } from 'react';
import {getPieceColor, getPieceShape} from './Piece';
import '../style/board.css';

const directions = ['up', 'right', 'down', 'left'];
const colorBg = '#3565d0';

const Board = ({pieceShape}) => {
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

    const insertPiece = (letter, direction, row, col) => {
        const newGrid = [...grid];
        const pieceShape = getPieceShape(letter, direction);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (pieceShape[i][j] !== colorBg) {
                    newGrid[row + i][col + j] = { color: pieceShape[i][j] };
                }
            }
        }
        setPiecePosition([row, col]);
        setGrid(newGrid);
    };

    const cleanGrid = (grid, row, col) => {
        for (let colPiece = col; colPiece < col + 4; colPiece++) {
            grid[row][colPiece].color = colorBg;
        }
    }

    const movePiece = (keyPlayer) => {
        const newGrid = [...grid];
        const [row, col] = piecePosition;

        cleanGrid(newGrid, row, col);

        switch (keyPlayer) {
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
                insertPiece(pieceShape, pieceDirection, row, col);
                break;
            default:
                break;
        }
        setGrid(newGrid);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    movePiece( 'ArrowLeft');
                    break;
                case 'ArrowRight':
                    movePiece( 'ArrowRight');
                    break;
                case 'ArrowDown':
                    movePiece( 'ArrowDown');
                    break;
                case 'ArrowUp':
                    movePiece( 'ArrowUp');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    /* inserting a new Piece */
    useEffect(() => {
        insertPiece(pieceShape, pieceDirection, 0, 3);
    }, [pieceShape]);

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