# red-tetris
42 school [subject](https://cdn.intra.42.fr/pdf/pdf/72691/en.subject.pdf).

The **front-end** must be a **single-page-application** and we must use **functions** instead of classes.<br>
We will use the framework **React** with library Redux.<br>
The frontend javascript will be **bundled** into an executable with **webpack** that the backend/server will send once to the client together with an index.html. This limits the number of HTTP requests, increasing website speed. 

In the backend we will use **classes** and write in **javascript with nodejs**. We will use **PostgreSQL** as database.

## How to run it

Go at the root of the repository

```
npm i --legacy-peer-deps
```

Then open two windows to launch the server and the client :

```
npm run srv-dev
```

```
npm run client-dev
```
