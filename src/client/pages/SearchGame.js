import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { searchGame, gameWaitForSomeoneToJoin, gameWaitQuit, gameWaitStart,
      gameStart, gameQuit } from "../api/http.api";
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
        const response = await gameWaitForSomeoneToJoin(game);
        if (response.status === 200) {
          setGame(response.data);
        }
    }
    const waitForSomeoneToQuit = async () => {
        const response = await gameWaitQuit(game);
        if (response.status === 200) {
          setGame(response.data);
        }
    }
    const waitStart = async () => {
        const response = await gameWaitStart(game);
        if (response.status === 200) {
          setPage("Game");
        }
    }
    if (page !== "SearchGame") return ;
    if (game !== null && game._player2 === null) {
      var interval1 = setInterval(waitForSomeoneToJoin, 2000);
    }
    if (game !== null && game._player2 !== null) {
      var interval2 = setInterval(waitForSomeoneToQuit, 2000);
    }
    if (game !== null && game._player2 === user) {
      var interval3 = setInterval(waitStart, 2000);
    }
    return () => {
      if (typeof interval1 !== undefined) clearInterval(interval1);
      if (typeof interval2 !== undefined) clearInterval(interval2);
      if (typeof interval3 !== undefined) clearInterval(interval3);
    }
  }, [game, page]);

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
              {game && game._player1 === user && <Button variant="outlined"
                    onClick={()=>{gameStart(game); setPage("Game");}}>
                Play
              </Button>}
            </div>)
  } else if (page === "Game") {
    return <div><Game user={user} game={game} setGame={setGame} setPage={setPage}/></div>
  }
}

export default SearchGame;
