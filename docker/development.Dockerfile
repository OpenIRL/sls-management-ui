FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY html/package*.json ./
RUN npm ci

# Copy source code (will be overridden by volume mount in docker-compose)
COPY html/ ./

EXPOSE 3000

CMD ["npm", "start"] 