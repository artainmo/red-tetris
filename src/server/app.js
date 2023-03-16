const express = require('express');
const { Player } = require(__dirname + '/classes/Player.js');
const { Game } = require(__dirname + '/classes/Game.js');


const app = express();
app.listen(3000, () => {
  console.log(`App listening at http://localhost:3000`)
});

/*
** When reading index.html the browser will have to make a HTTP GET request for the script it contains named 'bundle.js'.
** We use the following commands to serve static files found inside the repository containing the bundled app.
** This will allow the browser to make a HTTP GET request like so 'http://localhost:3000/bundle.js' to get the bundle.js file.
*/
const path_to_bundled_files = __dirname + "/../../dist/";
app.use(express.static(path_to_bundled_files));

//Send our bundled single-page-application frontend in one HTTP request when on homepage
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path_to_bundled_files});
});

//Create a router to separate all the HTTP requests aimed at communicating with the database
const router = express.Router()
app.use('/rest', router);

router.use(express.json()) //Parse incoming json bodies

router.get('/connect/:name', async (req,res,next) => {
  const name = req.params.name;
  const player = new Player();

  try {
    await player.connect(name);
    res.status(200).send(`Connection success of ${name}`)
  } catch (e) {
    console.log(e.message)
    res.status(400).send(e.message)
  }
});

router.get('/games/:name', async (req,res,next) => {
  const name = req.params.name;
  const player = new Player();

  await player.connect(name);
  const games = await player.getAllPastGames();
  res.status(200).json(games);
});

router.get('/game/search/:name', async (req,res,next) => {
  const name = req.params.name;
  const player = new Player();

  await player.connect(name);
  const game = await player.searchGame();
  res.status(200).json(game);
});

router.post('/game/wait/join', async (req,res,next) => {
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const newGame = await game.waitForSomeoneToJoin();
  if (newGame === false) {
    res.status(400).send("This game cannot be joined");
  } else {
    res.status(200).json(newGame);
  }
});

router.patch('/game/start', async (req,res,next) => {
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const ret = await game.start_play();
  if (ret === false) {
    res.status(400).send("Unable to start this game");
  } else {
    res.status(200).send(`Game started between ${body._player1} and ${body._player2}`);
  }
});

router.post('/game/wait/start', async (req,res,next) => {
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const ret = await game.waitGameStart();
  if (ret === false) {
    res.status(400).send("This game cannot be started");
  } else {
    res.status(200).send(`${body._player1} started the game`);
  }
});

router.post('/game/score/:score1/:score2?', async (req,res,next) => {
  const score1 = req.params.score1;
  const score2 = req.params.score2 || null;
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const newGame = await game.finalScore(score1, score2);
  if (newGame === false) {
    res.status(400).send("Final game score cannot be added")
  } else {
    res.status(200).json(newGame);
  }
});

router.post('/game/quit/:name', async (req,res,next) => {
  const name = req.params.name;
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const newGame = await game.quit(name);
  if (newGame === false) {
    res.status(400).send(`${name} is not able to quit ${body._player1} and ${body._player2}'s game`)
  } else {
    res.status(200).json(newGame)
  }
});

router.post('/game/next', async (req,res,next) => {
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  game.display()
  const newGame = await game.next_game();
  if (newGame === false) {
    res.status(400).send("This game is not finished. Can't go to next game.");
  } else {
    res.status(200).json(newGame);
  }
});

router.post('/game/wait/quit', async (req,res,next) => {
  const body = req.body;
  const game = new Game(body._id, body._player1, body._player2, body._player1_score,
    body._player2_score);

  const newGame = await game.waitForSomeoneToQuit();
  if (newGame === false) {
    res.status(400).send("This game cannot be quited");
  } else {
    res.status(200).json(newGame);
  }
});
