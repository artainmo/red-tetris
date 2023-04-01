import React, {useEffect, useState} from 'react'
import Board from '../components/Board';
import Button from '@mui/material/Button'
import { gameFinalScore, gameNext } from "../api/http.api"
import { connect, disconnect, joinRoom, listenOtherPlayerGameStructure,
         sendNextGame, listenNextGame } from "../api/socket.api"

const Tetris = ({user, game, setGame, setPage}) => {
  const [isActive, setIsActive] = useState(false);
  const socket = connect();
  const roomId = game._player1 + "_" + game._player2;
  const [otherPlayerGameStructure, setOtherPlayerGameStructure] = useState(null);

  useEffect(() => {
    joinRoom(socket, roomId);
    listenOtherPlayerGameStructure(socket, setOtherPlayerGameStructure);
    if (user === game._player2) listenNextGame(socket, setGame);
    return () => disconnect(socket);
  }, []);

  const endGame = async () => {
    if (game._player1 === user) {
      if (game._player2 === null) {
        await gameFinalScore(game, 25);
        game._player1_score = 25;
      } else {
        await gameFinalScore(game, 33, 44);
        game._player1_score = 33;
        game._player2_score = 44;
      }
      const response = await gameNext(game);
      if (game._player2 !== null) {
        sendNextGame(socket, roomId, response.data);
      }
      setGame(response.data);
    }
  }

  return (
      <div className="tetris">
        <Button variant="outlined" onClick={()=>{setPage("SearchGame");}}>
          Back
        </Button>
        <Button variant="outlined" onClick={()=>{endGame()}}>
          Simulate End Game
        </Button>

        { isActive ?
            <Button variant="outlined" onClick={()=>{setIsActive(false)}}>Stop</Button>
          :
            <Button variant="outlined" onClick={()=>{setIsActive(true)}}>Start</Button>
        }

        <Board isActive={isActive} setIsActive={setIsActive} socket={socket} user={user} game={game} roomId={roomId} />

      </div>
  );
};

export default Tetris;
