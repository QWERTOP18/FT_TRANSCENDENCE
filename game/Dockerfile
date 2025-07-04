FROM node:18.20-slim

WORKDIR /workspace/game
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
