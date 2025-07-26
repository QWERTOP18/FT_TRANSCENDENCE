FROM node:20-slim

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/gateway
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build
EXPOSE 8000
CMD ["npm", "start"]
