import React, { useState, useEffect } from 'react';
import '../style/board.css';
import getPieceShape from './Piece';

const Board = ({newPiece, pieceDirection}) => {
    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let row = 0; row < 20; row++) {
            const cells = [];
            for (let col = 0; col < 10; col++) {
                cells.push({
                    color: '#3565d0'
                });
            }
            rows.push(cells);
        }
        return rows;
    });

    const insertNewPiece = (letter, direction) => {
        const newGrid = [...grid];
        const pieceShape = getPieceShape(letter, direction);
        const startingRow = 0;
        const startingCol = Math.floor((10 - pieceShape[0].length) / 2);
        for (let row = 0; row < pieceShape.length; row++) {
            for (let col = 0; col < pieceShape[0].length; col++) {
                const cellValue = pieceShape[row][col];
                if (cellValue !== 0) {
                    const newRow = startingRow + row;
                    const newCol = startingCol + col;
                    newGrid[newRow][newCol] = { color: cellValue };
                }
            }
        }
        setGrid(newGrid);
    };

    useEffect(() => {
        insertNewPiece(newPiece, pieceDirection);
    }, []);

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