.PHONY: help install dev start test test-ui test-coverage build preview lint lint-fix clean ci

# Default target
help:
	@echo "Available targets:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start Vite development server"
	@echo "  make start          - Start Vite development server (alias for dev)"
	@echo "  make test           - Run tests with Vitest"
	@echo "  make test-ui        - Run tests with Vitest UI"
	@echo "  make test-coverage  - Run tests with coverage"
	@echo "  make build          - Build production bundle"
	@echo "  make preview        - Preview production build locally"
	@echo "  make lint           - Check code formatting"
	@echo "  make lint-fix       - Fix code formatting"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make ci             - Run all CI checks (test + build + lint)"

# Install dependencies
install:
	yarn install --frozen-lockfile

# Start Vite development server
dev:
	yarn dev

# Alias for dev
start: dev

# Run tests with Vitest
test:
	yarn test --run

# Run tests with Vitest UI
test-ui:
	yarn test:ui

# Run tests with coverage
test-coverage:
	yarn test:coverage --run

# Build production bundle
build:
	yarn build

# Preview production build
preview:
	yarn preview

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
