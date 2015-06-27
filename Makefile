default: all

SHELL := /bin/bash
PWD := $(shell pwd)

define dockerfile
FROM arla/10k
COPY . /var/lib/arla/app
RUN cd /var/lib/arla/app && npm install && npm run build
endef

export dockerfile

Dockerfile:
	/bin/echo -e "$$dockerfile" > Dockerfile

schema.js:
	cat schema/* > schema.js

actions.js:
	cat actions/* > actions.js

public/js/datastore.js: actions.js
	docker run -it --rm --name todomvc \
		-v $(PWD)/actions.js:/var/lib/arla/app/actions.js \
		arla/10k -generate-client > public/js/datastore.js

all: Dockerfile public/js/datastore.js schema.js actions.js

build: all
	docker build -t arla/todomvc$(TAG) .

run: all
	docker run -it --rm --name todomvc \
		-p 3000:80 \
		-v $(PWD)/data:/var/state \
		-v $(PWD):/var/lib/arla/app \
		-e AUTH_SECRET=testing \
		arla/10k

test: build
	echo "ok"

release: build
	docker push arla/todomvc$(TAG)

clean:
	rm -f schema.js
	rm -f actions.js
	rm -f public/js/datastore.js
	rm -f Dockerfile
	rm -rf ./node_modules
	docker rm -f todomvc || echo 'ok'
	docker rmi -f arla/todomvc || echo 'ok'

.PHONY: default build test run release clean enter
