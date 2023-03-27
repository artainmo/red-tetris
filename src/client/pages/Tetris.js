import React from 'react';
import Board from '../components/Board';
import Button from '@mui/material/Button'

const Tetris = () => {
    return (
        <div className="tetris">
          <Button variant="outlined">
            Back
          </Button>
          <Button variant="outlined">
            Simulate End Game
          </Button>

          <Board newPiece={'I'} />

        </div>
    );
};

export default Tetris;
