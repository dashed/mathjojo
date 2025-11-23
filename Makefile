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
	pnpm install --frozen-lockfile

# Start Vite development server
dev:
	pnpm dev

# Alias for dev
start: dev

# Run tests with Vitest
test:
	pnpm test --run

# Run tests with Vitest UI
test-ui:
	pnpm test:ui

# Run tests with coverage
test-coverage:
	pnpm test:coverage --run

# Build production bundle
build:
	pnpm build

# Preview production build
preview:
	pnpm preview

# Check code formatting with Prettier
lint:
	pnpm prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Fix code formatting with Prettier
lint-fix:
	pnpm prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"

# Clean build artifacts
clean:
	rm -rf build
	rm -rf coverage
	rm -rf node_modules
	rm -f pnpm-lock.yaml

# Run all CI checks
ci: test-coverage build lint
