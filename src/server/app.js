const express = require('express');

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

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path_to_bundled_files});
});
