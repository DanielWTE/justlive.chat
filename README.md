# JustLive.Chat

A live chat application with a frontend built with Next.js and a backend using Express and Prisma.

## Overview

JustLive.Chat is a modern live chat solution that enables website owners to communicate with their visitors in real-time. The application offers simple integration into existing websites and a user-friendly interface for administrators and visitors.

### Key Features

- **Real-time Chat**: Instant communication between website owners and visitors
- **Multi-Website Support**: Manage chats for multiple domains
- **User-friendly Dashboard**: Clear management of all chat rooms
- **Responsive Design**: Optimized for desktop and mobile
- **Easy Integration**: Quick integration into existing websites with a JavaScript snippet
- **Security**: JWT authentication and data protection

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Socket.IO Client
- **Backend**: Express, Socket.IO, Prisma, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker, Docker Compose

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/DanielWTE/justlive.chat.git
   cd justlive.chat
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by copying `.env.example` to `.env` and updating as needed
   ```
   cp .env.example .env
   ```
   **Important**: Always generate a secure random string for `JWT_SECRET`

4. Start the development servers:
   ```
   npm run dev
   ```

## Self-Hosted Deployment

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Clone the repository
   ```
   git clone https://github.com/DanielWTE/justlive.chat.git
   cd justlive.chat
   ```

2. Set up your environment variables by copying `.env.example` to `.env` and updating as needed
   ```
   cp .env.example .env
   ```

   **Important Environment Variables**:
   - `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/justlivechat` (for Docker)
   - `JWT_SECRET=your_jwt_secret_here` (generate a secure random string)
   - `NEXT_PUBLIC_API_URL=http://your-domain.com:4000` (or your backend URL)
   - `APP_ENV=production` (or "development" for testing)
   - `EXPRESS_PORT=4000` (backend port)
   - `FRONTEND_URL=http://your-domain.com:3000` (or your frontend URL)

3. Build and start the containers:
   ```
   docker-compose build --no-cache
   docker-compose up -d
   ```

   This ensures that the environment variables are properly passed to the Next.js build process.

4. The application will be available at:
   - Frontend: http://your-domain.com:3000 (or http://localhost:3000 for local deployment)
   - Backend API: http://your-domain.com:4000 (or http://localhost:4000 for local deployment)

### Environment Variables in Docker

The Docker setup is configured to handle environment variables correctly for Next.js:

1. **Build-time variables**: Environment variables needed during the Next.js build process are passed as build arguments in docker-compose.yml
2. **Runtime variables**: The same variables are also available at runtime in the container
3. **Production environment file**: A .env.production file is automatically created during the build process

If you need to update environment variables after deployment:

1. Update your `.env` file
2. Rebuild and restart the containers:
   ```
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Using a Reverse Proxy

For production deployments, it's recommended to use a reverse proxy like Nginx or Traefik:

1. Configure your reverse proxy to forward requests to the appropriate containers:
   - Frontend: Port 3000
   - Backend: Port 4000

2. Update your environment variables to use the correct URLs:
   - `NEXT_PUBLIC_API_URL=https://api.your-domain.com` (or your backend URL)
   - `FRONTEND_URL=https://your-domain.com` (or your frontend URL)

3. Rebuild the containers with the updated environment variables

### Stopping the Containers

```
docker-compose down
```

To remove volumes (including the database data):
```
docker-compose down -v
```

## Security Notes

When deploying this application, please consider the following security aspects:

1. **Environment Variables**:
   - Never commit your `.env` file to version control
   - Always use a strong, randomly generated value for `JWT_SECRET`
   - In production, consider using a secrets management solution

2. **Database**:
   - Change the default PostgreSQL credentials in production
   - Consider using a managed database service for production deployments

3. **API Access**:
   - The application uses JWT for authentication
   - Consider implementing rate limiting for production deployments

4. **HTTPS**:
   - Always use HTTPS in production
   - Configure your reverse proxy to handle SSL/TLS termination

## CI/CD with GitHub Actions

This project includes a GitHub Actions workflow for continuous integration and deployment.

### Workflow Features

- **Automated Testing**: Runs tests on every push and pull request
- **Docker Image Building**: Builds and pushes Docker images to GitHub Container Registry
- **Automated Deployment**: Deploys to production when changes are pushed to the main branch

### Setup Requirements

1. **GitHub Repository Secrets**:
   - Required:
     - `JWT_SECRET`: Your JWT secret key for authentication
   - Optional:
     - `FRONTEND_URL`: URL where the frontend is hosted (defaults to http://localhost:3000)
     - `NEXT_PUBLIC_API_URL`: URL for the API (defaults to http://localhost:4000/)

2. **Self-hosted Runner** (for deployment):
   - Required for the deployment job
   - Follow [GitHub's documentation](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners) to set up a self-hosted runner
   - The runner should have Docker and Docker Compose installed

### Workflow Steps

1. **Test**: Builds and tests the application
2. **Build and Push**: Creates Docker images and pushes them to GitHub Container Registry
3. **Deploy**: Pulls the latest images and deploys them using Docker Compose

### Manual Deployment

You can also manually trigger the workflow from the GitHub Actions tab in your repository.

## Database Management

### Prisma Commands

Generate Prisma Client:
```
npx prisma generate
```

Create and run migrations:
```
npx prisma migrate dev    # For development
npx prisma migrate deploy # For production
```

Open Prisma Studio (database GUI):
```
npx prisma studio
```

## Project Structure

- `/frontend` - Next.js frontend application
- `/backend` - Express backend API and Socket.IO server
  - `/prisma` - Database schema and migrations
  - `/src` - Backend source code

## Data Model

The application uses the following main entities:

- **User**: Administrators who manage websites and chats
- **Website**: Registered domains for chat integration
- **ChatRoom**: Individual chat sessions between visitors and administrators
- **ChatMessage**: Messages within a chat room
- **ChatParticipant**: Participants in a chat room (visitors or administrators)

## Integration into Your Website

To integrate JustLive.Chat into your website, simply add the following script to your HTML code:

```html
<script src="https://your-backend-url/embed.js" data-website-id="YOUR_WEBSITE_ID"></script>
```

Replace `YOUR_WEBSITE_ID` with the ID you receive in the dashboard after registering your website.

## Troubleshooting

### Environment Variables in Next.js

If you're experiencing issues with environment variables not being available in the frontend:

1. Make sure your `.env` file contains the correct variables
2. Rebuild the frontend container with `docker-compose build --no-cache frontend`
3. Check that the variables are correctly passed as build arguments in docker-compose.yml
4. Verify that the variables start with `NEXT_PUBLIC_` if they need to be accessible in the browser

### Database Connection Issues

If the backend can't connect to the database:

1. Check that the `DATABASE_URL` is correctly set in your `.env` file
2. Ensure the PostgreSQL container is running with `docker-compose ps`
3. Verify that the database has been initialized with `docker-compose logs postgres`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
