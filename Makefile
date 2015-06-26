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
	docker build -t arla/todomvc$(TAG) .

run: build
	docker run \
		-it --rm \
		-p 3000:80 \
		--name todomvc \
		-v $(PWD)/data:/var/state \
		-e AUTH_SECRET=testing \
		-e DEBUG=true \
		arla/todomvc$(TAG)

test: build
	echo "ok"

release: build
	docker push arla/todomvc$(TAG)

clean:
	rm -f Dockerfile
	rm -rf ./node_modules
	docker rm -f todomvc
	docker rmi arla/todomvc || echo 'ok'

.PHONY: default build test run release clean enter
