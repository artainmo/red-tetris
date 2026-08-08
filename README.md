# red-tetris

42 school [subject](https://cdn.intra.42.fr/pdf/pdf/170191/en.subject.pdf).

The **front-end** must be a **single-page-application** and we must use **functions (functional programming)** instead of classes (object-oriented-programming).<br>
We will use the framework **React** with library Redux.<br>
The frontend javascript will be **bundled** into an executable with **webpack** [[1](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9),[2](https://www.educative.io/answers/how-to-create-a-react-application-with-webpack)] that the backend/server will send once to the client together with an index.html. This limits the number of HTTP requests, increasing website speed.

In the **backend** we will use **classes (object-oriented-programming)** and write in **javascript** with **nodejs**, **express** for http-server and **socket.io** for socket implementation of the game. We will use **PostgreSQL** as database.

## Use

This project was created on macos, but Docker makes it possible to also run it on Linux.

### Run with Docker

As a prerequisite, create a `.env` file at the root of the project containing the database credentials, for example:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=red-tetris
```

Launch the app (builds the images and starts the containers in the background):
```
make docker_up
```
Access the app here: http://localhost:3000/.

Stop the app:
```
make docker_down
```

Make sure the containers are running (`make docker_up`) before refreshing the database or running tests below, since these commands need the `db` container.

Refresh the database:
```
make docker_refresh_database
```

Run tests:
```
make docker_test //Run tests
make docker_coverage //How much code is covered by the tests
```
`make test`, `npm run test`, `make coverage` and `npm run coverage` run directly on the host and expect a Postgres reachable at `localhost:5432` with credentials matching the hardcoded defaults, so they are not reliable once the app is launched with Docker; use the `docker_test`/`docker_coverage` targets above instead, which run inside a container on the same docker compose network as the `db` container and read the credentials from `.env`.

### Run without Docker

This was the original way the project was made to run, on macos. It is recommended for local development.

For the database we run a postgres server using the [postgres app](https://postgresapp.com) on macos. After downloading the postgres app, within the app you can click on 'initialize' to start the server.<br>
Now access the psql command line by double clicking a default database such as the one named 'template1'. Within the psql command line you can use the following commands to create a red-tetris database:
```
CREATE USER postgres;
ALTER USER postgres WITH PASSWORD 'admin';
CREATE DATABASE "red-tetris" OWNER postgres;
```
Make sure the postgres server runs while launching the app or cleaning the database.

Launch the whole app in one command:
```
make
```

Refresh the database:
```
make refresh_database
```

Run tests:
```
make test //Run tests without debug logs
npm run test //Same as prior command
make test_debug //Run tests with debug logs
make coverage //How much code is covered by the tests
npm run coverage //Same as prior command
```

Run the frontend only in dev-mode with hot reload:
```
make dev_front
```

Run the backend only in dev-mode with hot reload:
```
make dev_back
```

Run both the frontend and backend simultaneously in dev-mode with hot reload:
```
//In shell one
make dev_back
//In a second shell
make dev_back_front
```

## Bonus

* Creation de [maquette](https://www.figma.com/design/EcSggVnGa2EQdxmYEQqPvL/Red-Tetris).
* Scoring system
* Persistance of player scores.
