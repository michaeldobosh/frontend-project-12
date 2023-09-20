install:
	npm ci

server:
	npx start-server -a localhost -s ./frontend/build

start-frontend:
	make -C frontend start

deploy:
	git push heroku main

start:
	make server & make start-frontend