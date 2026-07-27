# red-tetris

42 school [subject](https://cdn.intra.42.fr/pdf/pdf/170191/en.subject.pdf).

The **front-end** must be a **single-page-application** and we must use **functions (functional programming)** instead of classes (object-oriented-programming).<br>
We will use the framework **React** with library Redux.<br>
The frontend javascript will be **bundled** into an executable with **webpack** [[1](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9),[2](https://www.educative.io/answers/how-to-create-a-react-application-with-webpack)] that the backend/server will send once to the client together with an index.html. This limits the number of HTTP requests, increasing website speed.

In the **backend** we will use **classes (object-oriented-programming)** and write in **javascript** with **nodejs**, **express** for http-server and **socket.io** for socket implementation of the game. We will use **PostgreSQL** as database.

## Use

This project was created on macos.

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

Run tests:
```
make test //Run tests without debug logs
npm run test //Same as prior command.
make test_debug //Run tests with debug logs
make coverage //How much code is covered by the tests
npm run coverage //Same as prior command.
```

## Bonus

* Creation de [maquette](https://www.figma.com/design/EcSggVnGa2EQdxmYEQqPvL/Red-Tetris).
* Scoring system
* Persistance of player scores.
