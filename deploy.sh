#!/bin/bash

# Municipality App Deployment Script

echo "🚀 Starting Municipality App Deployment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if command_exists docker; then
    echo "✅ Docker found"
    
    # Check if docker-compose is available
    if command_exists docker-compose; then
        echo "✅ Docker Compose found"
        echo "🐳 Starting with Docker Compose..."
        docker-compose up --build
    else
        echo "❌ Docker Compose not found. Please install Docker Compose."
        exit 1
    fi
else
    echo "❌ Docker not found. Starting manual deployment..."
    
    # Manual deployment
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    echo "🔧 Starting backend server..."
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 5
    
    echo "📦 Installing frontend dependencies..."
    cd ../frontend/municipality-frontend
    npm install
    
    echo "🏗️ Building frontend..."
    npm run build --configuration=production
    
    echo "✅ Deployment complete!"
    echo "Backend running on: http://localhost:4000"
    echo "GraphQL endpoint: http://localhost:4000/graphql"
    echo "Frontend built in: dist/municipality-frontend/browser/"
    
    # Keep the script running
    wait $BACKEND_PID
fi
