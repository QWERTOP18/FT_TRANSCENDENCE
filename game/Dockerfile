FROM node:20-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/game
COPY package*.json ./

RUN npm install --include=dev
COPY . .

RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
