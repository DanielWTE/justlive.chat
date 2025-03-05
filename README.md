# JustLive.Chat

A live chat application with a frontend built with Next.js and a backend using Express and Prisma.

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

## CI/CD with GitHub Actions

This project includes a GitHub Actions workflow for continuous integration and deployment.

### Workflow Features

- **Automated Testing**: Runs tests on every push and pull request
- **Docker Image Building**: Builds and pushes Docker images to GitHub Container Registry
- **Automated Deployment**: Deploys to production when changes are pushed to the main branch

### Setup Requirements

1. **GitHub Repository Secrets**:
   - `JWT_SECRET`: Your JWT secret key for authentication

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