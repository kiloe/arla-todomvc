default: all

DOCKER_REPO_NAME := arla/app
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
RUN := docker run -it $(RM) --entrypoint=/bin/bash -v $(PWD):/app arla/10k -c

#--------------------------------------

define dockerfile
FROM arla/10k
COPY . /var/lib/arla/app
endef
export dockerfile

#--------------------------------------

# generate a Dockfile
app/Dockerfile: app
	mkdir -p app
	/bin/echo -e "$$dockerfile" > $@

# copy all static assets
app/public: $(wildcard public/**/*)
	mkdir -p app
	cp -r ./public $@

# generate the schema file (just concat of all files)
app/schema.js:
	mkdir -p app
	cat schema/* > $@

# generate the action file (just concat of all files)
app/actions.js:
	mkdir -p app
	cat actions/* > $@

# generate an arla client library
src/datastore.js: app/actions.js
	docker run -it $(RM) \
		-v $(PWD)/app/actions.js:/var/lib/arla/app/actions.js \
		arla/10k -generate-client > $@

# install dependencies from npm
node_modules: package.json
	$(RUN) \
		"cd /app && npm install && npm install babelify uglifyify && chmod -R 666 $@"

# compile all sources into main index.js
# The weird /tmp/out is to workaround an issuing with timestamp inconsistancies
app/public/index.js: src/index.js src/datastore.js node_modules $(wildcard src/**/*)
	mkdir -p app/public
	$(RUN) \
		"cd /app && browserify $< -t babelify -t uglifyify --modules common -o $@ && chmod 666 $@"

# generate all app targets
all: app/public app/public/index.js app/schema.js app/actions.js

#--------------------------------------

# build into a self contained docker image
build: all app/Dockerfile
	docker build -t $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) app

# push the built image to docker hub
release: build
	docker push $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME)

#--------------------------------------

# start the app in a development mode
run: all
	docker run -it $(RM) \
		-p 3000:80 \
		-v $(PWD)/data:/var/state \
		-v $(PWD)/app:/var/lib/arla/app \
		-e AUTH_SECRET=testing \
		arla/10k

#--------------------------------------

# execute tests and exit
test:
	echo "ok"

#--------------------------------------

# repeatadly rebuild app/public/index.js whenever a file changes
watch: all
	watchify src/index.js -t babelify --modules common -o app/public/index.js

#--------------------------------------

# tidy up
clean:
	rm -rf app
	rm -f src/datastore.js
	rm -f npm-debug.log
	$(RUN) 'cd /app && rm -rf node_modules'
	docker rmi -f $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) 1>/dev/null 2>/dev/null \
		|| true

#--------------------------------------

.PHONY: default build test watch run release clean
