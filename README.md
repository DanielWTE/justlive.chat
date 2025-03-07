# JustLive.Chat

A live chat application with a frontend built with Next.js 15 and a backend using Express, Socket.IO, and Prisma with PostgreSQL.

## Overview

JustLive.Chat is a modern live chat solution that enables website owners to communicate with their visitors in real-time. The application offers simple integration into existing websites and a user-friendly interface for administrators and visitors.

### Key Features

- **Real-time Chat**: Instant communication between website owners and visitors
- **Multi-Website Support**: Manage chats for multiple domains
- **User-friendly Dashboard**: Clear management of all chat rooms
- **Responsive Design**: Optimized for desktop and mobile
- **Easy Integration**: Quick integration into existing websites with a JavaScript snippet
- **Security**: JWT authentication and data protection
- **Domain Verification**: Automatic verification of registered domains
- **Rate Limiting**: Protection against abuse

## Technology Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Socket.IO Client, SWR
- **Backend**: Express, Socket.IO, Prisma 6, PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: Docker, Docker Compose

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL (or Docker for containerized development)

### Local Development

1. Clone the repository
   ```
   git clone https://github.com/DanielWTE/justlive.chat.git
   cd /Users/dwagner/Desktop/justlive.chat
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
   cd /Users/dwagner/Desktop/justlive.chat
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
   - `BACKEND_URL=http://your-domain.com:4000` (or your backend URL)

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
   - `BACKEND_URL=https://api.your-domain.com` (or your backend URL)

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
   - Rate limiting is implemented to prevent abuse
   - CORS is configured to only allow registered domains

4. **HTTPS**:
   - Always use HTTPS in production
   - Configure your reverse proxy to handle SSL/TLS termination

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
  - `/src/app` - Next.js app router pages
  - `/src/components` - Reusable UI components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and libraries
  - `/src/schemas` - Zod validation schemas
  - `/src/types` - TypeScript type definitions

- `/backend` - Express backend API and Socket.IO server
  - `/prisma` - Database schema and migrations
  - `/src/api` - API route handlers
  - `/src/middleware` - Express middleware
  - `/src/socket` - Socket.IO event handlers
  - `/src/database` - Database utility functions

## Data Model

The application uses the following main entities:

- **User**: Administrators who manage websites and chats
- **Website**: Registered domains for chat integration
- **ChatRoom**: Individual chat sessions between visitors and administrators
- **ChatMessage**: Messages within a chat room
- **ChatParticipant**: Participants in a chat room (visitors or administrators)

## Integration into Your Website

To integrate JustLive.Chat into your website, add the following script to your HTML code:

```html
<script src="https://your-backend-url/embed.js?id=YOUR_WEBSITE_ID"></script>
```

Replace `YOUR_WEBSITE_ID` with the ID you receive in the dashboard after registering your website.

### Customization Options

You can customize the chat widget by adding parameters to the script URL:

```html
<script src="https://your-backend-url/embed.js?id=YOUR_WEBSITE_ID&colorPreset=purple&size=large&language=de"></script>
```

#### Available Parameters:

- **colorPreset**: Change the color theme of the chat widget
  - Options: `blue` (default), `green`, `purple`, `red`, `orange`, `dark`, `indigo`
- **size**: Adjust the size of the chat window
  - Options: `small`, `medium` (default), `large`
- **language**: Set the language of the chat interface
  - Options: `auto` (default, uses browser language), `en`, `de`
- **debug**: Enable debug mode for troubleshooting
  - Options: `true`, `false` (default)

#### Loading Optimization:

You can add standard HTML script attributes to optimize loading:

```html
<script src="https://your-backend-url/embed.js?id=YOUR_WEBSITE_ID" defer async></script>
```

### JavaScript API

JustLive.Chat also provides a JavaScript API for dynamic customization:

```javascript
// Change color theme
JustLiveChat.setColorPreset('purple');

// Change language
JustLiveChat.setLanguage('de');

// Change widget size
JustLiveChat.setSize('large');

// Toggle debug mode
JustLiveChat.toggleDebug(true);

// Get available color presets
const presets = JustLiveChat.getColorPresets();
```

### Customization in Dashboard

You can also generate and customize the embed code directly from your JustLive.Chat dashboard:

1. Go to the Websites section in your dashboard
2. Click the "Customize" button next to your website
3. Select your preferred options (color, size, language, etc.)
4. Copy the generated code and paste it into your website

This approach provides a visual preview of your customization options before implementation.


## Troubleshooting

### Environment Variables in Next.js

If you're experiencing issues with environment variables not being available in the frontend:

1. Make sure your `.env` file contains the correct variables
2. Rebuild the frontend container with `docker-compose build --no-cache frontend`
3. Check that the variables are correctly passed as build arguments in docker-compose.yml

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check that the PostgreSQL container is running: `docker-compose ps`
2. Verify the `DATABASE_URL` in your `.env` file
3. For local development outside Docker, update the `DATABASE_URL` to point to your local PostgreSQL instance

### Socket.IO Connection Issues

If real-time chat is not working:

1. Check that the domain is properly registered in the dashboard
2. Verify that CORS is properly configured for your domain
3. Check browser console for any connection errors
4. Ensure that the `NEXT_PUBLIC_API_URL` points to your backend server

## License

This project is licensed under the ISC License - see the LICENSE file for details.