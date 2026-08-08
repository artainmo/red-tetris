const { readFile } = require('fs/promises')
const { Client, Pool } = require('pg')

class database {
	constructor(connect = true) {
		this._credentials = {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || '5432',
			user: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'admin',
			database: process.env.DB_NAME || 'red-tetris',
		}
		if (connect) {
			this.connectToDatabase()
		}
	}

	async connectToDatabase() {
		this._pool = new Pool(this._credentials) //A connection pool enables handling multiple requests at once
	}

	async close_connection() {
		await this._pool.end() // generates error : Cannot use a pool after calling end on the pool
	}

	async createDatabase() {
		try {
			const client = new Client(this._credentials)
			await client.connect()
			const create_database_commands = await readFile(
				__dirname + '/designDatabase.sql',
				'utf8'
			)
			await client.query(create_database_commands)
			await client.end() //close connection
		} catch (err) {
			if (err.code === '42P07') {
				console.log('Database already exists.')
			} else {
				console.log('Create failed:', err.message, err.code)
				throw err
			}
		}
	}

	async destroy_database() {
		const client = new Client(this._credentials)
		await client.connect()
		await client.query('DROP TABLE game, account, player;')
		await client.end() //close connection
	}

	async query(request, values = []) {
		try {
			return await this._pool.query(request, values)
		} catch (e) {
			if (e.code === '42P01') {
				console.log('Table(s) missing, creating database schema...')
				await this.createDatabase()
				return await this._pool.query(request, values)
			}
			throw e
		}
	}
}

if (process.argv.length === 3 && process.argv[2] === 'create') {
	;(async () => {
		const db = new database(false)
		try {
			await db.createDatabase()
			console.log('Database created.')
		} catch (err) {
			console.log('Database already exist.')
			console.log(err.message)
			process.exit(0)
		}
	})()
} else if (process.argv.length === 3 && process.argv[2] === 'destroy') {
	;(async () => {
		const db = new database(false)
		try {
			await db.destroy_database()
			console.log('Database destroyed.')
		} catch (err) {
			console.log('Database already non-existent.')
			console.log(err.message)
			process.exit(0)
		}
	})()
}

module.exports.database = database
