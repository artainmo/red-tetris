
import React, {useEffect, useState} from 'react';
import Board from '../components/Board';
import Button from '@mui/material/Button';
import { gameFinalScore, gameNext } from "../api/http.api";
import { connect, disconnect, joinRoom, listenOtherPlayerGameStructure,
         sendNextGame, listenNextGame, sendGameState, listenGameState } from "../api/socket.api";
import '../style/tetris.css';
import Spectra from '../components/Spectra';

const Tetris = ({user, game, setGame, setPage}) => {
  const [isActive, setIsActive] = useState(false);
  const socket = connect();
  const roomId = game._player1 + "_" + game._player2;
  const [otherPlayerGameStructure, setOtherPlayerGameStructure] = useState(null);

  useEffect(() => {
    console.log("-------- joining room --------------")
    joinRoom(socket, roomId);
    listenGameState(socket, setIsActive);
    listenOtherPlayerGameStructure(socket, setOtherPlayerGameStructure);
    if (user === game._player2) listenNextGame(socket, setGame);
    //return () => disconnect(socket);
  }, []);

  const setGameState = (isActive) => {
    setIsActive(isActive);
    sendGameState(socket, roomId, isActive);
  };

  const simulEndGame = async () => {
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
        <div className="info-menu-section">
          <Button variant="outlined" onClick={()=>{setPage("SearchGame");}}>
            Back
          </Button>
          <Button variant="outlined" onClick={()=>{simulEndGame()}}>
            Simulate End Game
          </Button>

          {
            isActive && user === game._player1 ?
              <Button variant="outlined" onClick={() => {setGameState(false)}}>Stop</Button>
            :
              null
          }
          {
            !isActive && user === game._player1 ?
              <Button variant="outlined" onClick={()=>{setGameState(true)}}>Start</Button>
            :
              null
          }
        </div>
        <div className="board-section">
          <Board isActive={isActive} setIsActive={setIsActive} socket={socket} user={user} game={game} roomId={roomId} />
        </div>
        <div className="spectras-section">
          {
            otherPlayerGameStructure ?
              <Spectra grid={otherPlayerGameStructure} />
            :
              null
          }
        </div>

      </div>
  );
};

export default Tetris;
