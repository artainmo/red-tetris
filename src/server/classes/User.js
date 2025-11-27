class User {
	async connect(db, username) {
		if (username.length > 19) {
			throw new Error("Player's username is too long")
		}
		var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
		if (format.test(username)) {
			throw new Error("Player's username contains special characters")
		}
		await this.tryAccountCreation(db, username)
	}

	async tryAccountCreation(db, username) {
		console.log('Connecting to database, username:', username)
		try {
			await db.query('INSERT INTO account (username) VALUES ($1);', [username])
			console.log(`New account created named ${username}`)
		} catch (e) {
			if (e.code === '23505') {
				console.log(`Logged into account named ${username}`)
			} else {
				console.log(e.message.substr(0, 61))
				process.exit(1)
			}
		}
	}
}

module.exports.User = User
