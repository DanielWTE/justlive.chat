import { Socket } from 'socket.io';
import { findWebsiteById, isDomainRegistered } from '../database/fetch';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './events';

// Connection tracking for additional security
const connectionTracker = new Map<string, { count: number; lastReset: number }>();
const MAX_CONNECTIONS_PER_DOMAIN = 100;
const RESET_INTERVAL = 3600000; // 1 hour

// Import the domain cache check function from server.ts
let isDomainInCache: (domain: string) => boolean;
try {
  // Try to import the function dynamically
  const serverModule = require('../server');
  isDomainInCache = serverModule.isDomainInCache;
} catch (error) {
  // Fallback if import fails
  console.warn('Could not import domain cache function, using fallback');
  isDomainInCache = () => false;
}

const checkConnectionLimit = (domain: string): boolean => {
  const now = Date.now();
  const tracker = connectionTracker.get(domain) || { count: 0, lastReset: now };

  // Reset counter if interval passed
  if (now - tracker.lastReset > RESET_INTERVAL) {
    tracker.count = 1;
    tracker.lastReset = now;
    connectionTracker.set(domain, tracker);
    return true;
  }

  // Check if limit exceeded
  if (tracker.count >= MAX_CONNECTIONS_PER_DOMAIN) {
    return false;
  }

  // Increment counter
  tracker.count += 1;
  connectionTracker.set(domain, tracker);
  return true;
};

// Generate a unique session ID
const generateSessionId = (websiteId: string, socketId: string): string => {
  const randomBytes = Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString(36);
  return `${websiteId}-${socketId}-${timestamp}-${randomBytes}`;
};

export const socketAuth = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  next: (err?: Error) => void
) => {
  try {
    const websiteId = socket.handshake.auth.websiteId;
    const origin = socket.handshake.headers.origin;
    const userAgent = socket.handshake.headers['user-agent'];
    const ip = socket.handshake.address;
    const isAdmin = socket.handshake.auth.isAdmin === true;
    const providedSessionId = socket.handshake.auth.sessionId; // Get session ID if provided
    const isReconnectAttempt = socket.handshake.auth.reconnectAttempt === true;

    // Basic validation
    if (!websiteId || !origin || !userAgent) {
      return next(new Error('Socket authentication failed: Missing required headers'));
    }

    // Validate website
    const website = await findWebsiteById(websiteId);
    if (!website) {
      return next(new Error('Socket authentication failed: Invalid websiteId'));
    }

    // Skip domain validation for admin interface
    if (!isAdmin) {
      // Extract domain from origin
      const requestDomain = origin.toLowerCase()
        .replace(/^https?:\/\//, '')  // Remove protocol
        .replace(/:\d+$/, '')         // Remove port
        .replace(/\/$/, '');          // Remove trailing slash

      // Always allow justlive.chat subdomains
      if (!requestDomain.endsWith('.justlive.chat')) {
        // Validate origin against website domain
        const websiteDomain = website.domain.toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/:\d+$/, '')
          .replace(/\/$/, '');

        // Check if origin domain matches website domain
        if (requestDomain !== websiteDomain && 
            !requestDomain.endsWith(`.${websiteDomain}`) && 
            !websiteDomain.endsWith(`.${requestDomain}`)) {
          
          // Check if domain is in cache first
          if (isDomainInCache && isDomainInCache(requestDomain)) {
            // Domain is in cache, allow connection
          } else {
            // Additional check if the domain is registered in our system
            const isRegistered = await isDomainRegistered(requestDomain);
            if (!isRegistered) {
              console.warn('Domain mismatch and not registered:', { websiteDomain, requestDomain });
              return next(new Error('Socket authentication failed: Domain mismatch'));
            }
          }
        }
      }

      // Check connection limit for the domain
      if (!checkConnectionLimit(requestDomain)) {
        return next(new Error('Socket authentication failed: Too many connections from this domain'));
      }
    }

    // Bot detection (simple check, you might want to expand this)
    if (!isAdmin && userAgent && userAgent.toLowerCase().includes('bot')) {
      return next(new Error('Socket authentication failed: Bot detected'));
    }

    // Generate or use provided session ID
    const sessionId = providedSessionId && isReconnectAttempt 
      ? providedSessionId 
      : generateSessionId(websiteId, socket.id);

    // Log connection
    console.log(`[Socket-Auth] Socket ${isAdmin ? 'admin' : 'visitor'} connected:`, { 
      socketId: socket.id, 
      websiteId, 
      sessionId,
      isReconnectAttempt
    });

    // Set socket data
    socket.data = {
      sessionId,
      websiteId,
      domain: origin,
      connectTime: Date.now(),
      lastActivity: Date.now(),
      isAdmin,
      isReconnectAttempt
    };

    next();
  } catch (error) {
    console.error('Socket auth error:', error);
    next(new Error('Socket authentication failed: Internal error'));
  }
}; 