.PHONY: env start

install:
	npm install
	source ./conf/env
	./node_modules/.bin/babel-node scripts/zendesk_create_map.js

start:
	./node_modules/.bin/babel-node index.js

getusers:
	./node_modules/.bin/babel-node scripts/zendesk_list_user_ids.js

map:
	./node_modules/.bin/babel-node scripts/zendesk_create_map.js

env:
	source ./conf/env

clean:
	rm -rf ./node_modules
