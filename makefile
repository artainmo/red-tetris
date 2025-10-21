all:
	npm install && npm run build && npm run start

create_database:
	node src/server/database/manageDatabase.js create

destroy_database:
	node src/server/database/manageDatabase.js destroy

refresh_database: destroy_database create_database

dev_front:
	npm install && npm run dev_front

dev_back:
	npm install && npm run dev_back

dev_back_front:
	cd test/utils; python3 front_hot-reload.py

refresh_front:
	npm run build

unittest:
	node test/db_player_game/test.js

#  docker start red-tetris-db