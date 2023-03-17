import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { searchGame, gameWaitForSomeoneToJoin, gameWaitQuit, gameWaitStart, gameStart, gameQuit } from "../api/routes.api";
import Game from "../game/Game.tmp"

const SearchGame = ({user, page, setPage}) => {
  const [game, setGame] = useState(null);

  useEffect(() => {
    const findGame = async () => {
      const response = await searchGame(user);
      setGame(response.data);
    }
    findGame();
  }, []);

  useEffect(() => {
    const waitForSomeoneToJoin = async () => {
      if (game !== null && game._player2 === null) {
        const response = await gameWaitForSomeoneToJoin(game);
        setGame(response.data);
      }
    }
    const waitForSomeoneToQuit = async () => {
      if (game !== null && game._player2 !== null) {
        const response = await gameWaitQuit(game);
        setGame(response.data);
      }
    }
    const waitStart = async () => {
      if (game !== null && game._player2 === user) {
        await gameWaitStart(game);
        setPage("Game");
      }
    }
    waitForSomeoneToJoin();
    waitForSomeoneToQuit();
    waitStart();
  }, [game]);

  if (page === "SearchGame") {
    return (<div>
              <Button variant="outlined" onClick={()=>{
                    gameQuit(game, user); setPage("Home");}}>
                Back
              </Button>
              <Typography variant="h1">Tetris Game</Typography>
              <div>
                <Typography variant="h4">Players</Typography>
                <List>
                  {game ? <ListItem><ListItemText primary={game._player1}/></ListItem> : <ListItem><ListItemText primary={user}/></ListItem>}
                  {game && game._player2 && <ListItem><ListItemText primary={game._player2}/></ListItem>}
                </List>
              </div>
              <Button variant="outlined" onClick={()=>{
                    gameStart(game); setPage("Game");}}>
                Play
              </Button>
            </div>)
  } else if (page === "Game") {
    return <div><Game user={user} game={game} setGame={setGame} setPage={setPage}/></div>
  }
}

export default SearchGame;
