import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getGames } from "../api/http.api";
import SearchGame from "./SearchGame";

const Home = ({user, setUser}) => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState("Home");

  useEffect(() => {
    const getMyGames = async () => {
      const response = await getGames(user);
      setGames(response.data);
    }
    if (page === "Home") {
      getMyGames();
    }
  }, [page]);

  const displayGame = (player1, player2, score1, score2) => {
    if (player2 === null) {
      return `${player1}: ${score1}`;
    } else {
      return `${player1} vs ${player2} - ${score1} : ${score2}`;
    }
  }

  if (page === "Home") {
    return (<div>
              <Button variant="outlined" onClick={()=>{setUser(null);}}>
                Sign out
              </Button>
              <Typography variant="h1">{user}</Typography>
              <div>
                <Typography variant="h4">Games</Typography>
                <List>
                  {games.map((game, key)=> (
                    <ListItem key={key} >
                      <ListItemText primary={displayGame(game._player1,
                        game._player2, game._player1_score, game._player2_score)}/>
                    </ListItem>
                  ))}
                </List>
              </div>
              <Button variant="outlined" onClick={()=>{setPage("SearchGame");}}>
                Play
              </Button>
            </div>)
  } else {
    return <div><SearchGame user={user} page={page} setPage={setPage}/></div>
  }
}

export default Home;
