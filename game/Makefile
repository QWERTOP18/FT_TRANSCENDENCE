COMPOSE = docker compose -f docker-compose.yml

get_port_command = $(COMPOSE) port $1 $2 | cut -d: -f2

detach: CMD_FLAGS = -d
detach: up
	@echo "\e[34mSwagger UI started\e[m"
	@echo "Access swagger-ui at \e[1mhttp://localhost:$$($(call get_port_command,swagger-ui,8080))\e[m"
	@echo "Access swagger-editor at \e[1mhttp://localhost:$$($(call get_port_command,swagger-editor,8080))\e[m"
	@echo "Access mock-server at \e[1mhttp://localhost:$$($(call get_port_command,prism,4010))\e[m"

up:
	$(COMPOSE) $@ $(CMD_FLAGS)

down logs stats:
	$(COMPOSE) $@ $(CMD_FLAGS)
