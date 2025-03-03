import { Socket } from 'socket.io';
import { findWebsiteById } from '../database/fetch';
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './events';

// Connection tracking for additional security
const connectionTracker = new Map<string, { count: number; lastReset: number }>();
const MAX_CONNECTIONS_PER_DOMAIN = 100;
const RESET_INTERVAL = 3600000; // 1 hour

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

    // Basic validation
    if (!websiteId || !origin || !userAgent) {
      return next(new Error('Authentication failed: Missing required headers'));
    }

    // Validate website
    const website = await findWebsiteById(websiteId);
    if (!website) {
      return next(new Error('Authentication failed: Invalid websiteId'));
    }

    // Skip domain validation for admin interface
    if (!isAdmin) {
      // Validate origin against website domain
      const websiteDomain = website.domain.toLowerCase();
      const requestDomain = origin.toLowerCase()
        .replace(/^https?:\/\//, '')  // Remove protocol
        .replace(/:\d+$/, '')         // Remove port
        .replace(/\/$/, '');          // Remove trailing slash

      if (requestDomain !== websiteDomain) {
        console.warn(`Domain mismatch attempt from ${ip}: ${requestDomain} != ${websiteDomain}`);
        return next(new Error('Authentication failed: Domain mismatch'));
      }

      // Check connection limit for domain
      if (!checkConnectionLimit(requestDomain)) {
        console.warn(`Connection limit exceeded for domain: ${requestDomain}`);
        return next(new Error('Authentication failed: Too many connections from this domain'));
      }

      // Basic bot detection
      const suspiciousUserAgents = [
        'bot', 'crawler', 'spider', 'headless', 'puppet'
      ];
      if (suspiciousUserAgents.some(ua => userAgent.toLowerCase().includes(ua))) {
        console.warn(`Suspicious user agent detected from ${ip}: ${userAgent}`);
        return next(new Error('Authentication failed: Invalid client'));
      }
    }

    // Generate a unique session ID with additional entropy
    const randomBytes = Math.random().toString(36).substring(2);
    const timestamp = Date.now().toString(36);
    const sessionId = `${websiteId}-${socket.id}-${timestamp}-${randomBytes}`;
    
    // Attach data to socket
    socket.data.sessionId = sessionId;
    socket.data.websiteId = websiteId;
    socket.data.domain = origin;
    socket.data.connectTime = Date.now();
    socket.data.isAdmin = isAdmin;

    // Log successful connection
    console.log(`New ${isAdmin ? 'admin' : 'visitor'} connection from ${origin} (${ip}) at ${new Date().toISOString()}`);

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed: Internal error'));
  }
}; 