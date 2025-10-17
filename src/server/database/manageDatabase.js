const { readFile } = require('fs/promises');
const { Client, Pool } = require('pg');
const client = require('pg/lib/native/client');

(async () => {
	client = new Client(
		{
			host: "localhost",
			port: "5432",
			user: "postgres",
			password: "admin",
			database: "red_tetris"
		}
	);
	try {
    await client.connect();
    console.log("Connexion OK !");
    await client.end();
  } catch (err) {
    console.error("Erreur de connexion :", err.message);
  }
})();


class database {
	constructor(connect=true) {
		this._credentials = {
  			host: "localhost",
 			port: "5432",
			user: "postgres",
  			password: "admin",
  			database: "red_tetris"
		};
		if (connect) {
			this.connectToDatabase();
		}
	}

	async connectToDatabase() {
		try {
			console.log("1");
			this._pool = new Pool(this._credentials); //A connection pool enables handling multiple requests at once
			console.log("2");
			await this._pool.connect();
			console.log("3");
			await this._pool.query("SELECT * FROM account;") //Verify if tables exist
			console.log("Connected to database");
		} catch(e) {
			if (e.code === "42P01") {
				console.log(e.code)
				console.log("Create the database...")
				await this.createDatabase();
				this.connectToDatabase();
			} else {
				console.log(e.message);
				process.exit(1);
			}
		}
	}

	async close_connection() {
		await this._pool.end();  // generates error : Cannot use a pool after calling end on the pool
	}

	async createDatabase() {
		const client = new Client(client);
		await client.connect();
		console.log("Creating database...");
		const create_database_commands = await readFile(__dirname + "/designDatabase.sql", "utf8");
		await client.query(create_database_commands);
		await client.end(); //close connection
	}

	async destroy_database() {
		const client = new Client(this._credentials);
		await client.connect();
		await client.query("DROP TABLE game, account;");
		await client.end(); //close connection
	}

	async query(request, values=[]) {
		return await this._pool.query(request, values);
	}
}

if (process.argv.length === 3 && process.argv[2] === "create") {
	(async () => {
		db = new database(false);
		try { await db.createDatabase(); console.log("Database created.");
		} catch { console.log("Database already exist."); process.exit(0); }
	})();
} else if (process.argv.length === 3 && process.argv[2] === "destroy") {
	(async () => {
		db = new database(false);
		try { await db.destroy_database(); console.log("Database destroyed.");
		} catch(e) { console.log("Database already non-existent."); process.exit(0); }
	})();
}

module.exports.database = database;
