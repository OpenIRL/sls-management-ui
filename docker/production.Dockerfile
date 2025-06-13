FROM node:22-alpine

WORKDIR /app

# Install only http-server for serving static files
RUN npm install -g http-server

# Copy built app and run.js
COPY html/build/ /app
COPY html/run.js /run.js

EXPOSE 3000

# Use run.js to replace placeholders at runtime and serve the app
CMD ["node", "/run.js"]