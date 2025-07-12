.PHONY: help up down logs clean restart stop

# Default target
help:
	@echo "Available commands:"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs from all services"
	@echo "  make restart  - Restart all services"
	@echo "  make stop     - Stop all services"
	@echo "  make clean    - Remove all containers and volumes"


# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

stop:
	docker-compose stop

# Show logs from all services
logs:
	docker-compose logs -f

# Restart all services
restart: down up

# Clean up containers and volumes
clean:
	docker-compose down -v
	docker image prune -f --filter label=com.docker.compose.project=ft_transcendence


# Individual service commands
frontend-logs:
	docker-compose logs -f frontend

game-logs:
	docker-compose logs -f game

tournament-logs:
	docker-compose logs -f tournament

# Development commands
dev-build:
	docker-compose build --no-cache

dev-up:
	docker-compose up

# Safe rebuild commands
rebuild-frontend:
	docker-compose stop frontend
	docker-compose build --no-cache frontend
	docker-compose up -d frontend

rebuild-game:
	docker-compose stop game
	docker-compose build --no-cache game
	docker-compose up -d game

rebuild-tournament:
	docker-compose stop tournament
	docker-compose build --no-cache tournament
	docker-compose up -d tournament

# Individual service commands
frontend-up:
	docker-compose up frontend

game-up:
	docker-compose up game

tournament-up:
	docker-compose up tournament

# Individual service cleanup
frontend-clean:
	docker-compose stop frontend
	docker-compose rm -f frontend

game-clean:
	docker-compose stop game
	docker-compose rm -f game

tournament-clean:
	docker-compose stop tournament
	docker-compose rm -f tournament

