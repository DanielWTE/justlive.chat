#!/bin/bash

# Exit on error
set -e

# Configuration
GITHUB_USERNAME=${GITHUB_USERNAME:-"yourusername"}
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found. Please create it first."
  exit 1
fi

# Export environment variables from .env file
export $(grep -v '^#' $ENV_FILE | xargs)

# Replace GitHub username in docker-compose.prod.yml
sed -i '' "s/\${GITHUB_USERNAME}/$GITHUB_USERNAME/g" docker-compose.prod.yml

# Pull latest images
echo "Pulling latest Docker images..."
docker-compose -f docker-compose.prod.yml pull

# Start containers
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment completed successfully!"
echo "Frontend available at: ${FRONTEND_URL:-http://localhost:3000}"
echo "Backend available at: ${BACKEND_URL:-http://localhost:4000}" 