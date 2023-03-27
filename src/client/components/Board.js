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
                cells.push(<div key={`${row}${col}`} className="cell" ></div>);
            }
            rows.push(<div key={row} className="row">{cells}</div>);
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
    // useEffect(() => {
    //     insertNewPiece(newPiece);
    // }, []);

    return (
      <div className="board-wrapper">
          <div className="board">
              {grid}
          </div>
      </div>
    );
};

export default Board;