CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE account (
	username varchar(20) PRIMARY KEY
);

CREATE TABLE game (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	player1_id varchar(20) REFERENCES account(username) NOT NULL,
  player2_id varchar(20) REFERENCES account(username) DEFAULT NULL,
	player3_id varchar(20) REFERENCES account(username) DEFAULT NULL,
	player4_id varchar(20) REFERENCES account(username) DEFAULT NULL,
	player5_id varchar(20) REFERENCES account(username) DEFAULT NULL,
	player6_id varchar(20) REFERENCES account(username) DEFAULT NULL,
	-- player2_id varchar(20) REFERENCES account(username) DEFAULT NULL, -- To automatically create multiplayer games for testing, remove prior line and set this one
	player1_score INT DEFAULT NULL,
	player2_score INT DEFAULT NULL,
	player3_score INT DEFAULT NULL,
	player4_score INT DEFAULT NULL,
	player5_score INT DEFAULT NULL,
	player6_score INT DEFAULT NULL,
	locked boolean DEFAULT false
);
