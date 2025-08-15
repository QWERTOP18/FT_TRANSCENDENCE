#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to wait for a service to be ready
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=${3:-45}
    
    print_status $BLUE "Waiting for $service_name to be ready..."
    local counter=0
    
    while [ $counter -lt $max_attempts ]; do
        if curl -f -k -s "$url" > /dev/null 2>&1; then
            print_status $GREEN "✅ $service_name is ready!"
            return 0
        fi
        print_status $YELLOW "Waiting for $service_name... ($((counter + 1))/$max_attempts)"
        sleep 2
        counter=$((counter + 1))
    done
    
    print_status $RED "❌ Timeout waiting for $service_name"
    return 1
}

# Function to test service connectivity
test_service() {
    local service_name=$1
    local url=$2
    
    print_status $BLUE "🔍 Testing $service_name..."
    if curl -f -k -s "$url" > /dev/null; then
        print_status $GREEN "✅ $service_name OK"
        return 0
    else
        print_status $RED "❌ $service_name failed"
        return 1
    fi
}

# Function to run all service tests
run_service_tests() {
    local tests=(
        "nginx health endpoint:https://localhost:4430/health"
        "frontend:https://localhost:4430/"
        "game service:https://localhost:4430/game/ping"
        "tournament service:https://localhost:4430/tournament/api/"
        "gateway service:https://localhost:4430/api/"
        "auth service health:https://localhost:4430/auth/ping"
    )
    
    print_status $BLUE "=== Service Connectivity Test ==="
    
    for test in "${tests[@]}"; do
        IFS=':' read -r service_name url <<< "$test"
        if ! test_service "$service_name" "$url"; then
            exit 1
        fi
    done
}

# Main CI function
main() {
    print_status $BLUE "=== Starting CI Tests ==="
    
    # Disable bake to avoid target issues
    export COMPOSE_BAKE=false
    
    print_status $BLUE "Building Docker images..."
    docker compose build --no-cache
    
    print_status $BLUE "Starting services..."
    docker compose up -d
    
    # Wait for nginx to be ready
    if ! wait_for_service "nginx" "https://localhost:4430/health"; then
        exit 1
    fi
    
    # Wait for all services to be healthy
    print_status $BLUE "Waiting for all services to be healthy..."
    sleep 10
    
    # Run all service tests
    run_service_tests
    
    print_status $GREEN "🎉 === All CI Tests Completed Successfully ==="
}

# Run main function
main "$@"
