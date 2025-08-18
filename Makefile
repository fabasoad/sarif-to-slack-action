.DEFAULT_GOAL := build

.PHONY: audit
audit:
	@yarn npm audit --all

.PHONY: build
build:
	@yarn run build:esbuild

.PHONY: clean
clean:
	@rm -f yarn.lock
	@rm -rf node_modules

.PHONY: install
install:
	@yarn install

.PHONY: reinstall
reinstall: clean install

.PHONY: lint
lint:
	@yarn run lint

.PHONY: test/integration
test/integration:
	@npm run test:integration

.PHONY: test/unit
test/unit:
	@npm run test

.PHONY: test
test: test/unit

.PHONY: upgrade
upgrade:
	@pre-commit autoupdate
	@yarn upgrade-interactive
