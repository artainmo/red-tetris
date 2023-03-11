create_database:
	node src/server/database/manageDatabase.js create

destroy_database:
	node src/server/database/manageDatabase.js destroy

refresh_database: destroy_database create_database

unittest:
	node test/db_player_game/test.js
