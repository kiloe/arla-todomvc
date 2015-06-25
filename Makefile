default: build

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

build: Dockerfile
	docker build -t arla/todomvc .

run: build
	docker run \
		-it --rm \
		-p 3000:3000 \
		--name todomvc \
		-v $(PWD)/data:/var/lib/arla/data \
		-e AUTH_SECRET=testing \
		-e DEBUG=true \
		arla/todomvc

release: build
	docker push arla/todomvc

clean:
	rm -f Dockerfile
	rm -rf ./node_modules
	docker rmi arla/todomvc || echo 'ok'

.PHONY: default build run release clean enter
