src_js := $(shell find src -type f -name "*.js")

all: node_modules \
    xblocks-utils.js \
    xblocks-utils.min.js


node_modules: package.json
	npm install
	touch node_modules

clean:
	rm -f xblocks-utils.js
	rm -f xblocks-utils.min.js

xblocks-utils.js: node_modules $(src_js)
	./node_modules/.bin/borschik -m no -i src/xblocks.js > xblocks-utils.js

xblocks-utils.min.js: xblocks-utils.js
	./node_modules/.bin/borschik -i xblocks-utils.js -o xblocks-utils.min.js

test: node_modules
	./node_modules/.bin/jshint .
	./node_modules/.bin/jscs .
	./node_modules/karma/bin/karma start --single-run --browsers PhantomJS

.PHONY: all test clean
