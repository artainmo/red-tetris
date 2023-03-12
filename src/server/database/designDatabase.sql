CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE account (
	username varchar(20) PRIMARY KEY
);

CREATE TABLE game (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	player1_id varchar(20) REFERENCES account(username) NOT NULL,
	player2_id varchar(20) REFERENCES account(username) CHECK (player2_id != player1_id) DEFAULT NULL,
	player1_score INT DEFAULT NULL,
	player2_score INT DEFAULT NULL,
	locked boolean DEFAULT false
);
