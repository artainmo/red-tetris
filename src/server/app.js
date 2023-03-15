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

router.post('/connect/:name', async (req,res,next) => {
  const name = req.params.name;
  const player = new Player();

  try {
    await player.connect(name);
    res.status(200).send(`Connection success of ${name}`)
  } catch(e) {
    console.log(e.message)
    res.status(400).send(e.message)
  }
});
