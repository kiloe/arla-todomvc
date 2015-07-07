default: all

DOCKER_REPO_NAME := arla/todomvc
DOCKER_TAG_NAME := $(TAG)

#--------------------------------------

# fix issue where removing containers breaks ci
ifeq ($(CIRCLECI),true)
RM :=
else
RM := --rm
endif

#--------------------------------------

SHELL := /bin/bash
PWD := $(shell pwd)
BASE := arla/10k
RUN := docker run -it $(RM) -v $(PWD):/app -w /app
NPM := $(RUN) --entrypoint /usr/bin/npm $(BASE)
DELETE := $(RUN) --entrypoint /bin/rm $(BASE)
BROWSERIFY := $(RUN) --entrypoint /usr/local/bin/browserify $(BASE) -t [ /usr/local/lib/node_modules/babelify --modules common ]
WATCHIFY := $(RUN) --entrypoint /usr/local/bin/watchify $(BASE) -t [ /usr/local/lib/node_modules/babelify --modules common ]

#--------------------------------------

define dockerfile
FROM arla/10k
COPY . /app
endef
export dockerfile

#--------------------------------------

# generate a Dockfile
Dockerfile:
	/bin/echo -e "$$dockerfile" > $@

# generate the schema file (just concat of all files)
schema.js: $(wildcard schema/*)
	cat schema/* > $@

# generate the action file (just concat of all files)
actions.js: $(wildcard actions/*)
	cat actions/* > $@

# generate the client
public/index.js: actions.js schema.js
	$(NPM) install
	$(BROWSERIFY) src/index.js > $@

# generate all app targets
all: public/index.js

#--------------------------------------

# build into a self contained docker image
build: Dockerfile all
	docker build -t $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) .

# push the built image to docker hub
release: build
	docker push $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME)

#--------------------------------------

# start the app in a development mode
run: all
	docker run -it $(RM) \
		-p 3000:80 \
		-v $(PWD)/data:/var/state \
		-v $(PWD):/app \
		arla/10k

# start the app in a development mode
enter: all
	docker run -it $(RM) \
		--entrypoint /bin/bash \
		-v $(PWD)/data:/var/state \
		-v $(PWD):/app \
		arla/10k

#--------------------------------------

# execute tests and exit
test:
	echo "ok"

#--------------------------------------

# repeatadly rebuild public/index.js whenever a file changes
watch: all
	$(WATCHIFY) index.js -o public/index.js

#--------------------------------------

# tidy up
clean:
	rm -f Dockerfile
	rm -f actions.js
	rm -f schema.js
	rm -f npm-debug.log
	rm -f public/index.js
	$(DELETE) -rf node_modules
	docker rmi -f $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) 1>/dev/null 2>/dev/null \
		|| true

#--------------------------------------

.PHONY: default build test watch run release enter clean
