import React, { useState, useEffect } from 'react';
import '../style/board.css';
import getPieceShape from './Piece';

// const Board = ({newPiece}) => {
//     const [grid, setGrid] = useState([]);
//
//     const createGrid = () => {
//         const rows = [];
//         for (let row = 0; row < 20; row++) {
//             const cells = new Array(10).fill({ color: '#3565d0' })
//             rows.push(cells);
//         }
//         setGrid(rows);
//     };
//
//     const insertNewPiece = (piece) => {
//         const newGrid = [...grid];
//         const pieceShape = getPieceShape(piece);
//         for (let row = 0; row < 4; row++) {
//             for (let col = 4; col < 8; col++) {
//                 if (newGrid[row])
//                     newGrid[row][col] = { color: pieceShape[row][col - 4] };
//             }
//         }
//         setGrid(newGrid);
//     };
//
//     useEffect(() => {
//         createGrid();
//         //insertNewPiece(newPiece);
//     }, []);
//
//     return (
//       <div className="board-wrapper">
//           {grid}
//       </div>
//     );
// };
//
// export default Board;


const Board = ({newPiece}) => {
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

    // const insertNewPiece = (piece) => {
    //     const newGrid = [...grid];
    //     const pieceShape = getPieceShape(piece);
    //     for (let row = 0; row < 4; row++) {
    //         for (let col = 4; col < 8; col++) {
    //             newGrid[row][col] = { color: pieceShape[row][col - 4] };
    //         }
    //     }
    //     setGrid(newGrid);
    // };
    //
    const insertNewPiece = (letter) => {
        const newGrid = [...grid];
        const pieceShape = getPieceShape(letter);
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
        insertNewPiece(newPiece);
    }, [newPiece]);

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