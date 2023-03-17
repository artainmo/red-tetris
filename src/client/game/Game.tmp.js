import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import { gameFinalScore, gameNext } from "../api/routes.api"

const Game = ({user, game, setGame, setPage}) => {
  const endGame = async () => {
    if (game._player2 === null) {
      await gameFinalScore(game, 25);
    } else {
      await gameFinalScore(game, 44, 33);
    }
    const response = await gameNext(game);
    setGame(response.data);
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
