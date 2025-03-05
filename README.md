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

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1. Clone the repository
2. Set up your environment variables by copying `.env.example` to `.env` and updating as needed
   - Make sure to use `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/justlivechat` for Docker
   - Generate a secure random string for `JWT_SECRET`
3. Build and start the containers:
   ```
   docker-compose up -d
   ```
4. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

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
     - `NEXT_PUBLIC_EMBED_URL`: URL for the embed script (defaults to http://localhost:4000/embed.js)
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
<script src="http://your-backend-url/embed.js" data-website-id="YOUR_WEBSITE_ID"></script>
```

Replace `YOUR_WEBSITE_ID` with the ID you receive in the dashboard after registering your website.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
