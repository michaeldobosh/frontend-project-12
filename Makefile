install:
	npm ci

server:
	npx start-server -s ./frontend/build

start-frontend:
	make -C frontend start

deploy:
	git push heroku main

start:
	make server & make start-frontend