# red-tetris
42 school [subject](https://cdn.intra.42.fr/pdf/pdf/72691/en.subject.pdf).

The **front-end** must be a **single-page-application** and we must use **functions** instead of classes.<br>
We will use the framework **React** with library Redux.<br>
The frontend javascript will be **bundled** into an executable with **webpack** that the backend/server will send once to the client together with an index.html [[1](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9),[2](https://www.educative.io/answers/how-to-create-a-react-application-with-webpack)]. This limits the number of HTTP requests, increasing website speed. 

In the **backend** we will use **classes** and write in **javascript** with **nodejs**. We will use **PostgreSQL** as database.

## Use

Launch the whole app in one command:
```
make
```

Refresh the database:
```
make refresh_database
```

Run the frontend in dev-mode with hot reload:
```
make dev_front
```

Run unit-tests:
```
make unittest
```
