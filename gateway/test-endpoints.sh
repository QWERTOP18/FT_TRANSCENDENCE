#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Gateway Endpoint Tests
BASE_URL="http://localhost:8000"
USER_NAME="user$(date +%s)"

echo -e "${CYAN}=== Gateway Endpoint Tests ===${NC}"
echo -e "${BLUE}Base URL: $BASE_URL${NC}"
echo

# Function to print colored status
print_status() {
    local status=$1
    local message=$2
    if [[ $status == "SUCCESS" ]]; then
        echo -e "${GREEN}✓ $message${NC}"
    elif [[ $status == "ERROR" ]]; then
        echo -e "${RED}✗ $message${NC}"
    elif [[ $status == "WARNING" ]]; then
        echo -e "${YELLOW}⚠ $message${NC}"
    elif [[ $status == "INFO" ]]; then
        echo -e "${BLUE}ℹ $message${NC}"
    fi
}

# Health Check
echo -e "${PURPLE}1. Testing Health Check...${NC}"
HEALTH_RESPONSE=$(curl -s -X GET "$BASE_URL/ping")
if [[ "$HEALTH_RESPONSE" == "pong"* ]]; then
    print_status "SUCCESS" "Health check passed"
    echo -e "${GREEN}Response: $HEALTH_RESPONSE${NC}"
else
    print_status "ERROR" "Health check failed"
    echo -e "${RED}Response: $HEALTH_RESPONSE${NC}"
fi
echo

# Auth Endpoints
echo -e "${PURPLE}2. Testing Auth Endpoints...${NC}"

echo -e "${BLUE}2.1 Creating User...${NC}"
CREATE_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$USER_NAME\"}")
if echo "$CREATE_USER_RESPONSE" | grep -q '"id"'; then
    print_status "SUCCESS" "User created successfully"
    echo -e "${GREEN}Response: $CREATE_USER_RESPONSE${NC}"
    # Extract user ID
    USER_ID=$(echo "$CREATE_USER_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
else
    print_status "ERROR" "Failed to create user"
    echo -e "${RED}Response: $CREATE_USER_RESPONSE${NC}"
fi
echo

echo -e "${BLUE}2.2 Authenticating User...${NC}"
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/authenticate" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$USER_NAME\"}")
if echo "$AUTH_RESPONSE" | grep -q '"id"'; then
    print_status "SUCCESS" "User authenticated successfully"
    echo -e "${GREEN}Response: $AUTH_RESPONSE${NC}"
else
    print_status "ERROR" "Failed to authenticate user"
    echo -e "${RED}Response: $AUTH_RESPONSE${NC}"
fi
echo

# Tournament Endpoints
echo -e "${PURPLE}3. Testing Tournament Endpoints...${NC}"

echo -e "${BLUE}3.1 Getting All Tournaments...${NC}"
TOURNAMENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/tournaments" \
  -H "x-user-id: $USER_ID")
if echo "$TOURNAMENTS_RESPONSE" | grep -q '"statusCode"'; then
    print_status "WARNING" "Tournaments request failed (expected without user ID)"
    echo -e "${YELLOW}Response: $TOURNAMENTS_RESPONSE${NC}"
else
    print_status "SUCCESS" "Tournaments retrieved successfully"
    echo -e "${GREEN}Response: $TOURNAMENTS_RESPONSE${NC}"
fi
echo

echo -e "${BLUE}3.2 Creating Tournament...${NC}"
CREATE_TOURNAMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/tournaments" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "name": "Test Tournament",
    "description": "A test tournament",
    "max_num": 8,
    "rule": "simple"
  }')
if echo "$CREATE_TOURNAMENT_RESPONSE" | grep -q '"id"'; then
    print_status "SUCCESS" "Tournament created successfully"
    echo -e "${GREEN}Response: $CREATE_TOURNAMENT_RESPONSE${NC}"
    # Extract tournament ID
    TOURNAMENT_ID=$(echo "$CREATE_TOURNAMENT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
else
    print_status "ERROR" "Failed to create tournament"
    echo -e "${RED}Response: $CREATE_TOURNAMENT_RESPONSE${NC}"
fi
echo

# Extract tournament ID from response (if successful)
if [ ! -z "$TOURNAMENT_ID" ]; then
  echo -e "${CYAN}Tournament ID: $TOURNAMENT_ID${NC}"
  
  echo -e "${BLUE}3.3 Getting Tournament by ID...${NC}"
  GET_TOURNAMENT_RESPONSE=$(curl -s -X GET "$BASE_URL/tournaments/$TOURNAMENT_ID" \
    -H "x-user-id: $USER_ID")
  if echo "$GET_TOURNAMENT_RESPONSE" | grep -q '"id"'; then
      print_status "SUCCESS" "Tournament retrieved successfully"
      echo -e "${GREEN}Response: $GET_TOURNAMENT_RESPONSE${NC}"
  else
      print_status "ERROR" "Failed to get tournament"
      echo -e "${RED}Response: $GET_TOURNAMENT_RESPONSE${NC}"
  fi
  echo
  
  echo -e "${BLUE}3.4 Opening Tournament...${NC}"
  OPEN_TOURNAMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/tournaments/$TOURNAMENT_ID/open" \
    -H "x-user-id: $USER_ID")
  if echo "$OPEN_TOURNAMENT_RESPONSE" | grep -q '"statusCode"'; then
      print_status "WARNING" "Tournament open request failed"
      echo -e "${YELLOW}Response: $OPEN_TOURNAMENT_RESPONSE${NC}"
  else
      print_status "SUCCESS" "Tournament opened successfully"
      echo -e "${GREEN}Response: $OPEN_TOURNAMENT_RESPONSE${NC}"
  fi
  echo
  
  echo -e "${BLUE}3.5 Getting Tournament Participants...${NC}"
  PARTICIPANTS_RESPONSE=$(curl -s -X GET "$BASE_URL/tournaments/$TOURNAMENT_ID/participants" \
    -H "x-user-id: $USER_ID")
  if echo "$PARTICIPANTS_RESPONSE" | grep -q '"statusCode"'; then
      print_status "WARNING" "Failed to get participants"
      echo -e "${YELLOW}Response: $PARTICIPANTS_RESPONSE${NC}"
  else
      print_status "SUCCESS" "Participants retrieved successfully"
      echo -e "${GREEN}Response: $PARTICIPANTS_RESPONSE${NC}"
  fi
  echo
  
  echo -e "${BLUE}3.6 Joining Tournament...${NC}"
  JOIN_RESPONSE=$(curl -s -X POST "$BASE_URL/tournaments/$TOURNAMENT_ID/join" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USER_ID" \
    -d '{"userId": "'$USER_ID'"}')
  if echo "$JOIN_RESPONSE" | grep -q '"statusCode"'; then
      print_status "WARNING" "Failed to join tournament"
      echo -e "${YELLOW}Response: $JOIN_RESPONSE${NC}"
  else
      print_status "SUCCESS" "Joined tournament successfully"
      echo -e "${GREEN}Response: $JOIN_RESPONSE${NC}"
  fi
  echo
else
  print_status "ERROR" "Failed to create tournament or extract ID"
fi

# Battle Endpoints
echo -e "${PURPLE}4. Testing Battle Endpoints...${NC}"

if [ ! -z "$TOURNAMENT_ID" ]; then
  echo -e "${BLUE}4.1 Ready for Battle...${NC}"
  READY_BATTLE_RESPONSE=$(curl -s -X PUT "$BASE_URL/tournaments/$TOURNAMENT_ID/battle/ready" \
    -H "x-user-id: $USER_ID")
  if echo "$READY_BATTLE_RESPONSE" | grep -q '"statusCode"'; then
      print_status "WARNING" "Battle ready request failed"
      echo -e "${YELLOW}Response: $READY_BATTLE_RESPONSE${NC}"
  else
      print_status "SUCCESS" "Battle ready successfully"
      echo -e "${GREEN}Response: $READY_BATTLE_RESPONSE${NC}"
  fi
  echo
else
  echo -e "${YELLOW}4.1 Ready for Battle... (Skipped - no tournament ID)${NC}"
  echo
fi

echo -e "${BLUE}4.2 Cancel Battle...${NC}"
CANCEL_BATTLE_RESPONSE=$(curl -s -X POST "$BASE_URL/battle/cancel" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "userId": "'$USER_ID'",
    "battleId": "test-battle"
  }')
if echo "$CANCEL_BATTLE_RESPONSE" | grep -q '"statusCode"'; then
    print_status "WARNING" "Cancel battle request failed"
    echo -e "${YELLOW}Response: $CANCEL_BATTLE_RESPONSE${NC}"
else
    print_status "SUCCESS" "Battle cancelled successfully"
    echo -e "${GREEN}Response: $CANCEL_BATTLE_RESPONSE${NC}"
fi
echo

echo -e "${BLUE}4.3 AI Opponent...${NC}"
AI_OPPONENT_RESPONSE=$(curl -s -X POST "$BASE_URL/battle/ai" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "userId": "'$USER_ID'",
    "aiLevel": 1
  }')
if echo "$AI_OPPONENT_RESPONSE" | grep -q '"statusCode"'; then
    print_status "WARNING" "AI opponent request failed"
    echo -e "${YELLOW}Response: $AI_OPPONENT_RESPONSE${NC}"
else
    print_status "SUCCESS" "AI opponent request successful"
    echo -e "${GREEN}Response: $AI_OPPONENT_RESPONSE${NC}"
fi
echo

echo -e "${CYAN}=== Tests Complete ===${NC}" 
