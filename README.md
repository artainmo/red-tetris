# red-tetris

42 school [subject](https://cdn.intra.42.fr/pdf/pdf/72691/en.subject.pdf).

The **front-end** must be a **single-page-application** and we must use **functions (functional programming)** instead of classes (object-oriented-programming).<br>
We will use the framework **React** with library Redux.<br>
The frontend javascript will be **bundled** into an executable with **webpack** [[1](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9),[2](https://www.educative.io/answers/how-to-create-a-react-application-with-webpack)] that the backend/server will send once to the client together with an index.html. This limits the number of HTTP requests, increasing website speed.

In the **backend** we will use **classes (object-oriented-programming)** and write in **javascript** with **nodejs**, **express** for http-server and **socket.io** for socket implementation of the game. We will use **PostgreSQL** as database.

## Use

Before launching this app make sure a PostgreSQL database named `red_tetris` runs.

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

Run unit-tests:

```
make unittest
```

## Bonus

Creation de [maquette](https://www.figma.com/design/EcSggVnGa2EQdxmYEQqPvL/Red-Tetris).
