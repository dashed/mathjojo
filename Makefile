.PHONY: help install test test-coverage build lint lint-fix clean ci start

# Default target
help:
	@echo "Available targets:"
	@echo "  make install        - Install dependencies"
	@echo "  make test           - Run tests"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo "  make build          - Build production bundle"
	@echo "  make lint           - Check code formatting"
	@echo "  make lint-fix       - Fix code formatting"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make ci             - Run all CI checks (test + build + lint)"
	@echo "  make start          - Start development server"

# Install dependencies
install:
	yarn install --frozen-lockfile

# Run tests without coverage
test:
	yarn test --watchAll=false

# Run tests with coverage
test-coverage:
	yarn test --watchAll=false --coverage

# Build production bundle
build:
	yarn build

# Check code formatting with Prettier
lint:
	yarn prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Fix code formatting with Prettier
lint-fix:
	yarn prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Clean build artifacts
clean:
	rm -rf build
	rm -rf coverage
	rm -rf node_modules

# Run all CI checks
ci: test-coverage build lint

# Start development server
start:
	yarn start
