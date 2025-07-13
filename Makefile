default: help

# =============================================================================
# HELP
# =============================================================================

# Show help
help:
	@echo "Basic commands:"
	@echo "  make up                        - Start all services"
	@echo "  make down                      - Stop all services"
	@echo "  make logs                      - Show logs from all services"
	@echo "  make restart                   - Restart all services"
	@echo "  make stop                      - Stop all services"
	@echo "  make clean                     - Remove all containers and volumes"
	@echo ""
	@echo "Service commands:"
	@echo "  make logs-[service]            - Show [service] logs"
	@echo "  make rebuild-[service]         - Rebuild [service]"
	@echo ""
	@echo "Database commands:"
	@echo "  make [service]-prisma-studio   - Open [service] Prisma Studio"
	@echo "  make [service]-prisma-generate - Generate [service] Prisma client"
	@echo "  make [service]-prisma-migrate  - Run [service] database migrations"
	@echo "  make [service]-prisma-reset    - Reset [service] database"
	@echo "  make [service]-prisma-seed     - Run [service] database seed"


# =============================================================================
# DOCKER COMPOSE COMMANDS
# =============================================================================

# Start all services
up:
	docker-compose up -d
	@echo "┌───────────────────────────────────────────────────────────────┐"
	@echo "│                         BUILD SUCCESS                         │"
	@echo "├───────────────────────────────────────────────────────────────┤"
	@echo "│ Access Frontend    http://localhost:3000                      │"
	@echo "│ Access Gateway     http://localhost:8000    Not implemented   │"
	@echo "│ Access Auth        http://localhost:5000    Not implemented   │"
	@echo "│ Access User        http://localhost:6000    Not implemented   │"
	@echo "│ Access Game        http://localhost:4000/docs                 │"
	@echo "│ Access Tournament  http://localhost:8080/                     │"
	@echo "├───────────────────────────────────────────────────────────────┤"
	@echo "│ Show logs with 'make logs'                                    │"
	@echo "│ Show database with 'make [service]-prisma-studio'             │"
	@echo "│ Stop with 'make stop' and remove containers with 'make clean' │"
	@echo "└───────────────────────────────────────────────────────────────┘"

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


# =============================================================================
# SERVICE COMMANDS
# =============================================================================

# Individual service logs
logs-frontend:
	docker-compose logs -f frontend

logs-game:
	docker-compose logs -f game

logs-tournament:
	docker-compose logs -f tournament


# =============================================================================
# DATABASE COMMANDS
# =============================================================================

# Tournament Prisma commands
tournament-prisma-studio:
	docker-compose exec tournament npx prisma studio --hostname 0.0.0.0 --port 5555

tournament-prisma-reset:
	docker-compose exec tournament npx prisma migrate reset

tournament-prisma-seed:
	docker-compose exec tournament npx prisma db seed
