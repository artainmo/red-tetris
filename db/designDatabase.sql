CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS account (
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	username varchar(20) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS game (
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id varchar(20) PRIMARY KEY DEFAULT uuid_generate_v4(),
	locked boolean DEFAULT false,
	finished boolean DEFAULT false,
	host varchar(20) REFERENCES account(username) NOT NULL
);

CREATE TABLE IF NOT EXISTS player (
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (username, game_id),
	username varchar(20) REFERENCES account(username) NOT NULL,
	game_id varchar(20) REFERENCES game(id) NOT NULL,
	score INT DEFAULT 0,
	is_in_game BOOLEAN DEFAULT TRUE
);
