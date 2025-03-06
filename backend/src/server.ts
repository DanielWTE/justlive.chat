import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { handleAuthRegister } from "./api/auth/signup";
import { handleAuthLogin } from "./api/auth/login";
import { handleAuthSession } from "./api/auth/session";
import { handleLogout } from "./api/auth/logout";
import { handleWebsiteCreate, handleWebsiteList, handleGetWebsite, handleUpdateWebsite, handleDeleteWebsite } from "./api/websites";
import { handleEmbedGenerate } from "./api/embed";
import { handleGetMessages, handleVisitorLeft, handleGetChatRooms } from "./api/chat";
import { domainWhitelist } from "./middleware/domain";
import { domainRateLimit } from "./middleware/rateLimit";
import { authMiddleware } from "./middleware/auth";
import { socketAuth } from "./socket/auth";
import { handleChatEvents } from "./socket/chat";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./socket/events";
import usersRouter from './api/users';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Enhanced security configuration for Socket.IO
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: process.env.APP_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://justlive.chat', 'https://justlive.chat', /\.justlive\.chat$/]
      : true,
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingTimeout: 20000,
  pingInterval: 25000,
  connectTimeout: 10000,
  maxHttpBufferSize: 1e6, // 1 MB max message size
  transports: ["websocket", "polling"],
  allowEIO3: true,
  allowUpgrades: true,
});

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'https://justlive.chat', /\.justlive\.chat$/] as any,
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
  origin: function(origin, callback) {
    if(!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://justlive.chat',
      'https://justlive.chat',
      'https://api.justlive.chat',
      'http://localhost:3000',
    ];
    
    if(allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.justlive.chat')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Website-ID'],
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    error: process.env.APP_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Auth routes
app.post("/auth/signup", handleAuthRegister);
app.post("/auth/login", handleAuthLogin);
app.get("/auth/session", authMiddleware, handleAuthSession);
app.post("/auth/logout", handleLogout);

// Users routes
app.use("/users", usersRouter);

// Website routes
app.post("/websites/create", authMiddleware, handleWebsiteCreate);
app.get("/websites/list", authMiddleware, handleWebsiteList);
app.get("/websites/:id", authMiddleware, handleGetWebsite);
app.put("/websites/:id", authMiddleware, handleUpdateWebsite);
app.delete("/websites/:id", authMiddleware, handleDeleteWebsite);

// Embed script route (no auth required, but rate limited)
app.get("/embed.js", domainRateLimit, handleEmbedGenerate);

// Chat routes with different middleware for admin vs visitor
// Admin route - only requires authentication
app.get("/chat/messages/:roomId", authMiddleware, handleGetMessages);
app.get("/chat/rooms", authMiddleware, handleGetChatRooms);

// Visitor routes - require domain whitelist and rate limit
app.use("/chat/visitor", domainWhitelist, domainRateLimit);

// API endpoint for visitor leaving (sendBeacon fallback)
app.post("/chat/visitor-left", express.json(), handleVisitorLeft(io));

// Socket.IO setup with enhanced monitoring
io.use(socketAuth);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Monitor socket health
  const activityInterval = setInterval(() => {
    if (socket.data.lastActivity) {
      const inactiveTime = Date.now() - socket.data.lastActivity;
      if (inactiveTime > 300000) { // 5 minutes
        console.log(`Disconnecting inactive socket: ${socket.id}`);
        socket.disconnect(true);
      }
    }
  }, 60000); // Check every minute

  // Update last activity on any event
  const updateActivity = () => {
    socket.data.lastActivity = Date.now();
  };
  socket.onAny(updateActivity);

  // Handle chat events
  handleChatEvents(io, socket);

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    clearInterval(activityInterval);
    console.log("Client disconnected:", socket.id);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.EXPRESS_PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
