FROM node:20-alpine AS builder

WORKDIR /app

# Define build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG APP_ENV

# Set environment variables for build time
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV APP_ENV=$APP_ENV

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .env.production file with build arguments
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.production
RUN echo "APP_ENV=$APP_ENV" >> .env.production

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Define build arguments again for the production stage
ARG NEXT_PUBLIC_API_URL
ARG APP_ENV

# Set environment variables for runtime
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV APP_ENV=$APP_ENV

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000

CMD ["npm", "start"] 