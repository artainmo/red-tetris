import React, {useEffect, useState} from 'react'
import Board from '../components/Board';
import Button from '@mui/material/Button'

const Tetris = () => {
  const [isActive, setIsActive] = useState(false);

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

        <Board isActive={isActive} />

      </div>
  );
};

export default Tetris;
