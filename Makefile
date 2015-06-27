default: all

DOCKER_REPO_NAME := arla/app
DOCKER_TAG_NAME := $(TAG)

#--------------------------------------

SHELL := /bin/bash
PWD := $(shell pwd)

#--------------------------------------

# fix issue where removing containers breaks ci
ifneq ($(CIRCLECI),true)
RM := --rm
endif

#--------------------------------------

define dockerfile
FROM arla/10k
COPY . /var/lib/arla/app
endef
export dockerfile

#--------------------------------------

define packagejson
{
  "name": "arla-app",
  "version": "0.0.1",
  "description": "Arla/React Application.",
  "main": "src/app.js",
  "dependencies": {
    "kefir": "^1.1.0",
    "node-uuid": "^1.4.2",
    "react": "^0.13.0-beta.1",
    "whatwg-fetch": "^0.7.0"
  },
  "devDependencies": {
    "babelify": "^5.0.3",
    "browserify": "^9.0.3"
  },
  "browserify": {
    "transform": [
      "babelify"
    ]
  }
}
endef
export packagejson

#--------------------------------------

define indexhtml
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Arla App</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
</html>
endef
export indexhtml

#--------------------------------------

# generate a default package.json if missing
package.json:
	/bin/echo -e "$$packagejson" > $@

# generate the output dir
app:
	mkdir -p app

# generate a Dockfile
app/Dockerfile: app
	/bin/echo -e "$$dockerfile" > $@

# generate the public dir if missing
public:
	mkdir -p public

# copy all static assets
app/public: public app
	cp -r public app/

# generate the schema file (just concat of all files)
app/schema.js: app
	cat schema/* > $@

# generate the action file (just concat of all files)
app/actions.js: app
	cat actions/* > $@

# generate an arla client library
src/datastore.js: app/actions.js
	docker run -it $(RM) \
		-v $(PWD)/app/actions.js:/var/lib/arla/app/actions.js \
		arla/10k -generate-client > $@

# compile all sources into main index.js
app/public/index.js: src/datastore.js app/public package.json
	docker run -it $(RM) --entrypoint=/bin/bash \
		-v $(PWD):/app arla/10k -c \
		"cd /app && npm install && browserify src/index.js --modules common -o /$@"

# generate index.html if missing
public/index.html:  | public
	/bin/echo -e "$$indexhtml" > $@

# ensure there is an index.html
app/public/index.html: public/index.html app/public
	cp $< $@

# generate all app targets
all: app/public/index.html app/public/index.js app/schema.js app/actions.js

# build into a self contained docker image
build: all app/Dockerfile
	docker build -t $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) app

# start the app in a development mode
run: all
	docker run -it $(RM) \
		-p 3000:80 \
		-v $(PWD)/data:/var/state \
		-v $(PWD)/app:/var/lib/arla/app \
		-e AUTH_SECRET=testing \
		arla/10k

# execute tests and exit
test:
	echo "ok"

# push the built image to docker hub
release: build
	docker push $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME)

# tidy up
clean:
	rm -rf app
	rm -f src/datastore.js
	rm -f npm-debug.log
	docker run -it $(RM) --entrypoint=/bin/bash \
		-v $(PWD):/app arla/10k -c \
		'cd /app && rm -rf node_modules'
	docker rmi -f $(DOCKER_REPO_NAME)$(DOCKER_TAG_NAME) 1>/dev/null 2>/dev/null \
		|| true

.PHONY: default build test run release clean
