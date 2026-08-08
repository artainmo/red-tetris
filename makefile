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

docker_up: check_env
	docker compose up --build
#'--build' rebuilds the app image so it picks up code changes instead of reusing a stale cached image.

docker_down:
	docker compose down

docker_create_database: check_env
	docker compose run --build --rm app node src/server/database/manageDatabase.js create

docker_destroy_database: check_env
	docker compose run --build --rm app node src/server/database/manageDatabase.js destroy

docker_refresh_database: docker_destroy_database docker_create_database

docker_test: check_env
	docker compose run --build --rm app npm run test
#'docker compose run' starts a one-off container from the 'app' image, separate from the long-running
#one started by 'make docker_up', so it does not conflict with it (eg. on the port it binds internally).
#It automatically starts the 'db' container first if it isn't already running.

docker_coverage: check_env
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

check_env:
	@if [ ! -f .env ]; then \
		echo "Error: no .env file found at the project root."; \
		echo "Create one as described in the README (see 'Run with Docker'), e.g.:"; \
		echo "  POSTGRES_USER=postgres"; \
		echo "  POSTGRES_PASSWORD=admin"; \
		echo "  POSTGRES_DB=red-tetris"; \
		exit 1; \
	fi
#Without a .env file, POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB are substituted as empty strings
#by docker compose, which lets postgres start with no credentials and then fail its healthcheck
#instead of raising a clear error, so docker commands depend on this check to fail fast with a clear message.


