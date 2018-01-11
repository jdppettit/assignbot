.PHONY: install env start

install:
	npm install

start:
	./node_modules/.bin/babel-node index.js

getusers:
	./node_modules/.bin/babel-node scripts/zendesk_list_user_ids.js

env:
	source conf/env
