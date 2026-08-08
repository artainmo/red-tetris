all: docker_up

clean:
	docker compose down -v

re: clean all

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
	cd ancient_tests/utils; python3 front_hot-reload.py

refresh_front:
	npm run build

test:
	npm run test
#'npm run test' as described in 'package.json' will run Jest.
#Jest is a Javascript testing framework.

test_debug: refresh_database
	jest integration.test.js -dbg=true
#'-dbg=true' is an argument the file can take to indicate you want debug logs
#If you want to debug open handles in the test file: 'make refresh_database && npx jest --detectOpenHandles -- integration.test.js -dbg=false'

coverage: refresh_database
	npm run coverage
#'npm run coverage' as described in 'package.json' will run 'jest --coverage'
#Coverage indicates how much of the code has been tested.

docker_up:
	docker compose up --build -d
#'--build' rebuilds the app image so it picks up code changes instead of reusing a stale cached image.
#'-d' runs the containers detached (in the background), freeing up the terminal.

docker_down:
	docker compose down

docker_create_database:
	docker compose run --build --rm app node src/server/database/manageDatabase.js create

docker_destroy_database:
	docker compose run --build --rm app node src/server/database/manageDatabase.js destroy

docker_refresh_database: docker_destroy_database docker_create_database

docker_test:
	docker compose run --build --rm app npm run test
#'docker compose run' starts a one-off container from the 'app' image, separate from the long-running
#one started by 'make docker_up', so it does not conflict with it (eg. on the port it binds internally).
#It automatically starts the 'db' container first if it isn't already running.

docker_coverage:
	docker rm -f red-tetris-coverage >/dev/null 2>&1; \
	docker compose run --build --name red-tetris-coverage app npm run coverage; \
	rm -rf coverage; \
	docker cp red-tetris-coverage:/app/coverage ./coverage; \
	docker rm red-tetris-coverage >/dev/null
#'npm run coverage' (see package.json) starts with 'rm -rf coverage', which cannot target a mounted
#host folder (the container would see it as busy), so instead the container keeps its own 'coverage'
#folder and 'docker cp' copies it out to this project's own 'coverage' folder on the host afterwards.
#'docker compose run' starts a one-off container from the 'app' image, separate from the long-running
#one started by 'make docker_up', so it does not conflict with it (eg. on the port it binds internally).
#It automatically starts the 'db' container first if it isn't already running.
