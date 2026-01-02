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

test: refresh_database
	npm test -- integration.test.js -dbg=false
#'npm test' as described in 'package.json' will run Jest.
#Jest is a Javascript testing framework.

test_debug: refresh_database
	npm test -- integration.test.js -dbg=true
#'-dbg=true' is an argument the file can take to indicate you want debug logs
#If you want to debug open handles in the test file: 'make refresh_database && npx jest --detectOpenHandles -- integration.test.js -dbg=false'
