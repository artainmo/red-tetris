import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import { connect } from "../api/http.api"
import Home from './Home'
import Tetris from './Tetris'

const Auth = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [nameTooLong, setNameTooLong] = useState(false);
  const [nameInvalidChars, setNameInvalidChars] = useState(false);

  const userConnect = async () => {
    if (name === "") return ;
    const response = await connect(name);
    if (response.status === 400 && response.data === "Player's username is too long") {
      setNameInvalidChars(false);
      setNameTooLong(true);
    } else if (response.status === 400 && response.data === "Player's username contains special characters") {
      setNameTooLong(false);
      setNameInvalidChars(true);
    } else if (response.status === 200) {
      setNameInvalidChars(false);
      setNameTooLong(false);
      setUser(name);
    }
  }

  if (user === null) {
    return (<Tetris />);
    return (<div>
              <TextField variant="outlined" placeholder="name" value={name}
                    onChange={(e)=>{setName(event.target.value);}} />
              <br/>
              {nameTooLong && <div><br/><Typography>Name is too long.</Typography></div>}
              {nameInvalidChars && <div><br/><Typography>Name cannot contain special characters.</Typography></div>}
              <br/>
              <Button variant="outlined" onClick={()=>{userConnect()}}>
                Connect
              </Button>
            </div>);
  } else {
    return <div><Home user={user} setUser={setUser}/></div>
  }
}

export default Auth;
