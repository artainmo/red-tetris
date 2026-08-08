class User {
	async connect(db, username) {
		if (username.length > 19) {
			throw new Error("Player's username is too long")
		}
		const format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
		if (format.test(username)) {
			throw new Error("Player's username contains special characters")
		}
		await this.tryAccountCreation(db, username)
	}

	async tryAccountCreation(db, username) {
		console.log('Connecting to database, username:', username)
		try {
			//'ON CONFLICT DO NOTHING' lets an existing user log back in with the same username without
			//Postgres ever raising a unique-violation error for it (this used to throw and get caught
			//below, which is expensive and made Postgres log a scary-looking "ERROR: duplicate key..."
			//for what is actually just a normal, expected login).
			const result = await db.query(
				'INSERT INTO account (username) VALUES ($1) ON CONFLICT (username) DO NOTHING;',
				[username]
			)
			if (result.rowCount > 0) {
				console.log(`New account created named ${username}`)
			} else {
				console.log(`Logged into account named ${username}`)
			}
		} catch (e) {
			console.log(e.message.substr(0, 61))
			process.exit(1)
		}
	}
}

module.exports.User = User
