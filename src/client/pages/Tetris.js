import React, {useEffect, useState} from 'react'
import Board from '../components/Board';
import Button from '@mui/material/Button'

const Tetris = () => {
  const [pieceShape, setPieceShape] = useState('I');

  return (
      <div className="tetris">
        <Button variant="outlined">
          Back
        </Button>
        <Button variant="outlined">
          Simulate End Game
        </Button>

        <Board pieceShape={pieceShape} />

      </div>
  );
};

export default Tetris;
