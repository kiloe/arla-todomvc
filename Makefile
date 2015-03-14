default: build

SHELL := /bin/bash
PWD := $(shell pwd)

Dockerfile:
	cat <<<'END' > Dockerfile
		FROM arla/10k
		COPY . /var/lib/arla/app
		RUN cd /var/lib/arla/app && npm install && npm run build
	END

build: Dockerfile
	docker build -t arla/todomvc .

test:
	npm install && npm run build
	docker run \
		-it --rm \
		-p 3000:3000 \
		--name todomvc \
		-v $(PWD):/var/lib/arla/app \
		-v $(PWD)/data:/var/lib/arla/data \
		-e AUTH_SECRET=testing \
		-e DEBUG=true \
		arla/10k

release: build
	docker push arla/10k

clean:
	rm -f Dockerfile
	rm -rf ./node_modules
	docker rmi arla/todomvc || echo 'ok'

.PHONY: default build test release clean enter
