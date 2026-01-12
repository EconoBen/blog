# Blog Makefile
# This Makefile provides convenient commands for development, testing, and deployment

# Default target - show help
.DEFAULT_GOAL := help

# Variables
NODE_BIN := node_modules/.bin
PORT := 3001
VISUAL_TEST_FILE := tests/visual-regression-test.html

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)Blog Development Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make dev              # Start development server"
	@echo "  make test-visual      # Open visual regression tests"
	@echo "  make deploy          # Deploy to Vercel preview"
	@echo "  make deploy-prod     # Deploy to Vercel production"

# Development Commands
.PHONY: install
install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install

.PHONY: dev
dev: ## Start development server (port 3000)
	@echo "$(BLUE)Starting Next.js development server...$(NC)"
	npm run dev

.PHONY: build
build: fetch-gists ## Build for production
	@echo "$(BLUE)Building for production...$(NC)"
	npm run build

.PHONY: serve
serve: build ## Build and serve production build locally
	@echo "$(BLUE)Serving Next.js production build...$(NC)"
	npm start

# Testing Commands
.PHONY: test
test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	npm test

.PHONY: test-visual
test-visual: ## Open visual regression test in browser
	@echo "$(BLUE)Opening visual regression tests...$(NC)"
	@echo "$(YELLOW)Make sure the dev server is running on port $(PORT)$(NC)"
	@open $(VISUAL_TEST_FILE) || xdg-open $(VISUAL_TEST_FILE) || echo "$(RED)Please open $(VISUAL_TEST_FILE) manually$(NC)"

.PHONY: lint
lint: ## Run ESLint
	@echo "$(BLUE)Running ESLint...$(NC)"
	npm run lint

.PHONY: typecheck
typecheck: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type check...$(NC)"
	npx tsc --noEmit

# Image and PDF Processing
.PHONY: process-images
process-images: ## Optimize images in assets/originals
	@echo "$(BLUE)Optimizing images...$(NC)"
	npm run optimize-images

.PHONY: process-pdfs
process-pdfs: ## Generate PDF thumbnails and publications
	@echo "$(BLUE)Processing PDFs...$(NC)"
	npm run process-pdfs

.PHONY: add-image
add-image: ## Add and optimize a new image (usage: make add-image IMG=path/to/image.jpg YEAR=2025 MONTH=01)
	@if [ -z "$(IMG)" ]; then \
		echo "$(RED)Error: Please specify IMG=path/to/image.jpg$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Adding and optimizing image: $(IMG)$(NC)"
	node scripts/add-image.js "$(IMG)" "$(YEAR)" "$(MONTH)"

# Vercel Deployment Commands
.PHONY: deploy
deploy: ## Deploy to Vercel (preview)
	@echo "$(BLUE)Deploying to Vercel preview...$(NC)"
	@echo "$(YELLOW)This will create a preview deployment with a unique URL$(NC)"
	npx vercel

.PHONY: deploy-prod
deploy-prod: ## Deploy to Vercel (production)
	@echo "$(RED)⚠️  WARNING: This will deploy to PRODUCTION$(NC)"
	@echo "$(YELLOW)Are you sure? Press Ctrl+C to cancel, or Enter to continue$(NC)"
	@read confirm
	@echo "$(BLUE)Deploying to Vercel production...$(NC)"
	npx vercel --prod

.PHONY: vercel-logs
vercel-logs: ## View Vercel deployment logs
	@echo "$(BLUE)Viewing Vercel logs...$(NC)"
	npx vercel logs

.PHONY: vercel-list
vercel-list: ## List recent Vercel deployments
	@echo "$(BLUE)Listing recent deployments...$(NC)"
	npx vercel list

# Git and GitHub Commands
.PHONY: pr
pr: ## Create a pull request using GitHub CLI
	@echo "$(BLUE)Creating pull request...$(NC)"
	gh pr create

.PHONY: commit
commit: ## Create a commit with AI-generated message
	@echo "$(BLUE)Creating commit...$(NC)"
	@echo "$(YELLOW)This will analyze changes and create a commit$(NC)"
	git add -A && git commit

# Utility Commands
.PHONY: clean
clean: ## Clean build artifacts and caches
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf .next/
	rm -rf node_modules/.cache/
	rm -rf .eslintcache

.PHONY: clean-all
clean-all: clean ## Clean everything including node_modules
	@echo "$(RED)Removing node_modules...$(NC)"
	rm -rf node_modules/
	rm -f package-lock.json

.PHONY: reset
reset: clean-all install ## Full reset - clean everything and reinstall
	@echo "$(GREEN)Full reset complete!$(NC)"

.PHONY: audit
audit: ## Run npm audit
	@echo "$(BLUE)Running security audit...$(NC)"
	npm audit

.PHONY: audit-fix
audit-fix: ## Run npm audit fix (use with caution!)
	@echo "$(YELLOW)⚠️  WARNING: This may break dependencies$(NC)"
	@echo "$(YELLOW)Consider using 'npm audit' first to review issues$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to cancel, or Enter to continue$(NC)"
	@read confirm
	npm audit fix

.PHONY: update-deps
update-deps: ## Check for outdated dependencies
	@echo "$(BLUE)Checking for outdated dependencies...$(NC)"
	npm outdated || true

# Docker Commands (if you add Docker support later)
.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t blog:latest .

.PHONY: docker-run
docker-run: ## Run Docker container
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -p 3001:3001 blog:latest

# Combined Commands
.PHONY: dev-full
dev-full: ## Start dev server with all preprocessing
	@echo "$(BLUE)Running full development setup...$(NC)"
	$(MAKE) fetch-gists
	$(MAKE) process-pdfs
	$(MAKE) process-images
	$(MAKE) dev

.PHONY: pre-deploy
pre-deploy: ## Run all checks before deployment
	@echo "$(BLUE)Running pre-deployment checks...$(NC)"
	$(MAKE) fetch-gists
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) build
	@echo "$(GREEN)✓ All checks passed! Ready to deploy.$(NC)"

.PHONY: check-links
check-links: ## Check for broken links (requires server running)
	@echo "$(BLUE)Checking for broken links...$(NC)"
	@echo "$(YELLOW)Make sure the dev server is running on port $(PORT)$(NC)"
	npx linkinator http://localhost:$(PORT) --recurse

# Environment Setup
.PHONY: setup
setup: ## Initial project setup
	@echo "$(BLUE)Setting up project...$(NC)"
	$(MAKE) install
	@echo "$(GREEN)Creating .env.local file...$(NC)"
	@if [ ! -f .env.local ]; then \
		echo "# Next.js Environment Variables" > .env.local; \
		echo "# Add your environment variables here" >> .env.local; \
		echo "$(GREEN)✓ Created .env.local file$(NC)"; \
	else \
		echo "$(YELLOW).env.local file already exists$(NC)"; \
	fi
	@echo "$(GREEN)✓ Setup complete!$(NC)"

# Documentation
.PHONY: docs
docs: ## Show detailed documentation
	@echo "$(BLUE)Blog Project Documentation$(NC)"
	@echo ""
	@echo "$(GREEN)Quick Start:$(NC)"
	@echo "  1. make setup         # Initial setup"
	@echo "  2. make dev          # Start development"
	@echo "  3. make test-visual  # Test responsive design"
	@echo ""
	@echo "$(GREEN)Development Workflow:$(NC)"
	@echo "  - make dev           # Start dev server"
	@echo "  - make test-visual   # Open visual tests"
	@echo "  - make lint          # Check code quality"
	@echo "  - make commit        # Commit changes"
	@echo ""
	@echo "$(GREEN)Deployment Workflow:$(NC)"
	@echo "  1. make pre-deploy   # Run all checks"
	@echo "  2. make deploy       # Preview deployment"
	@echo "  3. make deploy-prod  # Production deployment"
	@echo ""
	@echo "$(GREEN)Image Management:$(NC)"
	@echo "  - Add images to public/assets/originals/"
	@echo "  - Run 'make process-images' to optimize"
	@echo "  - Or use 'make add-image IMG=path/to/image.jpg'"
	@echo ""
	@echo "$(GREEN)Troubleshooting:$(NC)"
	@echo "  - make reset         # Full reset if things break"
	@echo "  - make audit         # Check security issues"
	@echo "  - make clean         # Clean build artifacts"

# GitHub Gist Integration
.PHONY: create-gists
create-gists: ## Create all workshop gists on GitHub
	@echo "$(BLUE)Creating all workshop gists...$(NC)"
	@if [ -z "$$GITHUB_TOKEN" ]; then \
		echo "$(RED)Error: GITHUB_TOKEN not set. Export your GitHub token first.$(NC)"; \
		exit 1; \
	fi
	$(MAKE) gist-git
	$(MAKE) gist-python
	$(MAKE) gist-json
	$(MAKE) gist-zsh-config
	@echo "$(GREEN)✓ All gists created!$(NC)"
	@echo "$(BLUE)Fetching gists into workshop...$(NC)"
	$(MAKE) fetch-gists

.PHONY: fetch-gists
fetch-gists: ## Fetch workshop gists from GitHub
	@echo "$(BLUE)Fetching workshop gists from GitHub...$(NC)"
	@if [ -z "$$OPENAI_TOKEN" ]; then \
		echo "$(YELLOW)Note: OPENAI_TOKEN not set. Using basic titles/descriptions.$(NC)"; \
		echo "$(YELLOW)To enable AI-enhanced descriptions: export OPENAI_TOKEN=\"your-key\"$(NC)"; \
	fi
	npm run fetch-gists
