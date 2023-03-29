import React, {useEffect, useState} from 'react'
import Board from '../components/Board';
import Button from '@mui/material/Button'

const Tetris = () => {
  const [pieceLetter, setPieceLetter] = useState('');
  const [pieceShape, setPieceShape] = useState([]);
  const [isActive, setIsActive] = useState(false);


  // gameloop
  useEffect(() => {
    if (isActive) {
      var interval = setInterval(() => {
        const pieces = ['I', 'J', 'L', 'S', 'Z', 'T', 'O'];
        const randomIndex = Math.floor(Math.random() * pieces.length);
        setPieceLetter(pieces[randomIndex]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
      <div className="tetris">
        <Button variant="outlined">
          Back
        </Button>
        <Button variant="outlined">
          Simulate End Game
        </Button>

        { isActive ?
            <Button variant="outlined" onClick={()=>{setIsActive(false)}}>Stop</Button>
          :
            <Button variant="outlined" onClick={()=>{setIsActive(true)}}>Start</Button>
        }

        <Board pieceShape={pieceShape} />

      </div>
  );
};

export default Tetris;
