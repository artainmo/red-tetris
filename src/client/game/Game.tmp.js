import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { gameFinalScore, gameNext } from "../api/http.api"
import { connect, disconnect, joinRoom } from "../api/socket.api"

const Game = ({user, game, setGame, setPage}) => {

  useEffect(() => {
    const socket = connect();
    joinRoom(socket, game._player1 + "_" + game._player2);
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
      setGame(response.data);
    } else {
      //get game created by player1 via sockets
      //setGame()
    }
    setPage("SearchGame");
  }

  return (<div>
            <Button variant="outlined" onClick={()=>{setPage("SearchGame");}}>
              Simulate Quit Game
            </Button>
            <Button variant="outlined" onClick={()=>{endGame()}}>
              Simulate End Game
            </Button>
          </div>)
}

export default Game;
