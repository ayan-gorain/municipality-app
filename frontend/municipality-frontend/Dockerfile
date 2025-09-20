# Multi-stage build for Angular app
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the Angular app
RUN npm run build --configuration=production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built app from build stage
COPY --from=build /app/dist/municipality-frontend/browser ./browser
RUN cp -r ./browser/* ./ && rm -rf ./browser

# Install http-server globally
RUN npm install -g http-server

# Expose port (Render will set PORT environment variable)
EXPOSE 8080

# Start the server
CMD ["sh", "-c", "http-server . -p $PORT -a 0.0.0.0"]