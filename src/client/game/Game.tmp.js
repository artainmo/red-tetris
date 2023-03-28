import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { gameFinalScore, gameNext } from "../api/http.api"
import { connect, disconnect, joinRoom, listenOtherPlayerGameStructure,
      listenNewPiece, sendNextGame, listenNextGame, askNewPiece,
      sendPersonalGameStructure } from "../api/socket.api"
import Board from '../components/Board'

const Game = ({user, game, setGame, setPage}) => {
  const socket = connect();
  const roomId = game._player1 + "_" + game._player2;
  const [newPiece, setNewPiece] = useState(null);
  const [otherPlayerGameStructure, setOtherPlayerGameStructure] = useState(null);

  useEffect(() => {
    joinRoom(socket, roomId);
    listenNewPiece(socket, setNewPiece);
    listenOtherPlayerGameStructure(socket, setOtherPlayerGameStructure);
    if (user === game._player2) listenNextGame(socket, setGame);
    return () => disconnect(socket);
  }, []);

  useEffect(() => {
    var interval = setInterval(() => {
      if (socket !== null) {
        if (user === game._player1) {
          askNewPiece(socket, roomId);
        }
        //sendPersonalGameStructure(socket, roomId, gameStructure);
      }
    }, 5000);
    return () => clearInterval(interval);
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

  return (<div>
            <Button variant="outlined" onClick={()=>{setPage("SearchGame");}}>
              Back
            </Button>
            <Button variant="outlined" onClick={()=>{endGame()}}>
              Simulate End Game
            </Button>

            <Board />

            <p>(host should simulate end first and only afterwards players can leave)</p>
            <p>SIMULATE PIECE DISTRIBUTION</p>
            {newPiece && <p>{newPiece.type + " " + newPiece.direction + " " + newPiece.position}</p>}
          </div>)
}

export default Game;
