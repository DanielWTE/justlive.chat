(() => {
  // Configuration
  const BACKEND_URL = '{{BACKEND_URL}}';

  // Get website ID and debug mode from script tag
  const currentScript = document.currentScript;
  const scriptUrl = new URL(currentScript.src);
  const websiteId = scriptUrl.searchParams.get('id');
  let debugMode = scriptUrl.searchParams.get('debug') === 'true';

  // Setup logging based on debug mode
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  // Function to toggle debug mode
  const toggleDebugMode = (enable) => {
    debugMode = enable === undefined ? !debugMode : !!enable;
    
    if (!debugMode) {
      console.log = function() {};
      console.warn = function() {};
      console.info = function() {};
      // Keep error logging for critical errors
      console.error = function(message) {
        if (message && message.toString().includes('JustLive Chat:')) {
          originalConsole.error.apply(console, arguments);
        }
      };
      originalConsole.log('[JustLive Debug] Debug mode deactivated');
    } else {
      // Add prefix to all logs in debug mode
      console.log = function() {
        const args = Array.from(arguments);
        originalConsole.log.apply(console, ['[JustLive Debug]', ...args]);
      };
      console.warn = function() {
        const args = Array.from(arguments);
        originalConsole.warn.apply(console, ['[JustLive Debug]', ...args]);
      };
      console.error = function() {
        const args = Array.from(arguments);
        originalConsole.error.apply(console, ['[JustLive Debug]', ...args]);
      };
      console.info = function() {
        const args = Array.from(arguments);
        originalConsole.info.apply(console, ['[JustLive Debug]', ...args]);
      };
      
      console.log('Debug mode activated');
    }
    
    return debugMode;
  };

  // Expose debug toggle function globally
  window.JustLiveChat = window.JustLiveChat || {};
  window.JustLiveChat.toggleDebug = toggleDebugMode;
  window.JustLiveChat.isDebugMode = () => debugMode;
  
  // Initialize console based on initial debug mode
  toggleDebugMode(debugMode);

  if (!websiteId) {
    console.error('JustLive Chat: Missing website ID');
    return;
  }

  // Create and inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    .justlive-chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .justlive-chat-button {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: #0070f3;
      box-shadow: 0 4px 14px 0 rgba(0, 118, 255, 0.39);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .justlive-chat-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 118, 255, 0.23);
    }
    
    .justlive-chat-button:active {
      transform: translateY(0) scale(0.95);
    }
    
    .justlive-chat-button.admin-online::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(0, 112, 243, 0.4);
      z-index: -1;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      70% {
        transform: scale(1.3);
        opacity: 0;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }
    
    .justlive-chat-icon {
      width: 30px;
      height: 30px;
      fill: white;
    }

    .justlive-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      height: 450px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0.9);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .justlive-chat-window.open {
      transform: scale(1);
      opacity: 1;
      pointer-events: all;
    }

    .justlive-chat-header {
      padding: 16px;
      background: #0070f3;
      color: white;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    .justlive-chat-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .justlive-chat-close {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s ease;
      color: white;
      font-size: 14px;
    }

    .justlive-chat-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .justlive-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f8fafc;
      scroll-behavior: smooth;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .justlive-chat-input-container {
      padding: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
      background: #ffffff;
    }

    .justlive-chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
      background: #ffffff;
    }

    .justlive-chat-input:focus {
      border-color: #0070f3;
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
    }

    .justlive-chat-send {
      padding: 12px 18px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .justlive-chat-send:hover {
      background: #0061d5;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .justlive-chat-send:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .justlive-chat-message {
      margin-bottom: 8px;
      max-width: 100%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
      animation: messageIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      display: inline-block;
      width: auto;
    }
    
    .justlive-chat-admin-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      margin-left: 8px;
      font-weight: 500;
    }
    
    .justlive-chat-admin-status.online {
      background: #dcfce7;
      color: #166534;
    }
    
    .justlive-chat-admin-status.offline {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .justlive-chat-admin-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
    }
    
    .justlive-chat-admin-status.online .justlive-chat-admin-status-dot {
      background: #22c55e;
    }
    
    .justlive-chat-admin-status.offline .justlive-chat-admin-status-dot {
      background: #ef4444;
    }

    .justlive-chat-user-form {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-bottom: 16px;
    }
    
    .justlive-chat-form-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #1f2937;
    }
    
    .justlive-chat-form-field {
      margin-bottom: 16px;
    }
    
    .justlive-chat-form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      color: #4b5563;
    }
    
    .justlive-chat-form-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
    }
    
    .justlive-chat-form-input:focus {
      border-color: #0070f3;
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
    }
    
    .justlive-chat-form-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .justlive-chat-form-submit {
      width: 100%;
      padding: 12px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .justlive-chat-form-submit:hover {
      background: #0061d5;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .justlive-chat-message-time {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 4px;
      text-align: right;
      opacity: 0.8;
    }
    
    .justlive-chat-message-wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      max-width: 80%;
    }
    
    .justlive-chat-message-wrapper.visitor {
      align-self: flex-end;
      margin-left: auto;
    }
    
    .justlive-chat-message-wrapper.agent {
      align-self: flex-start;
    }
    
    .justlive-chat-message:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @keyframes messageIn {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .justlive-chat-message.visitor {
      background: #0070f3;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .justlive-chat-message.agent {
      background: #f3f4f6;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }

    .justlive-chat-message.system {
      background: #f3f4f6;
      color: #6b7280;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 8px;
      max-width: 80%;
      font-weight: 500;
      border: 1px solid #e5e7eb;
    }
    
    .justlive-chat-message-wrapper.system {
      align-self: center;
      margin-left: auto;
      margin-right: auto;
      max-width: 80%;
      margin-bottom: 16px;
      margin-top: 8px;
    }
    
    .justlive-chat-message-wrapper.system .justlive-chat-message-time {
      text-align: center;
    }

    .justlive-chat-message.system::before {
      content: '';
      display: block;
      height: 1px;
      background: #e5e7eb;
      width: 40px;
      margin: 0 auto 6px;
      opacity: 0.7;
    }
    
    .justlive-chat-message.system::after {
      content: '';
      display: block;
      height: 1px;
      background: #e5e7eb;
      width: 40px;
      margin: 6px auto 0;
      opacity: 0.7;
    }

    .justlive-chat-timestamp {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      margin: 8px 0;
    }

    .justlive-chat-welcome {
      text-align: center;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      margin: 16px auto;
      max-width: 90%;
      animation: fadeIn 0.5s ease;
    }

    .justlive-chat-welcome-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #111827;
    }

    .justlive-chat-welcome-message {
      color: #6b7280;
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 1.5;
    }

    .justlive-chat-start-button {
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      display: inline-block;
    }

    .justlive-chat-start-button:hover {
      background: #0061d5;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .justlive-chat-ended {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin: 20px auto;
      max-width: 90%;
      text-align: center;
      animation: fadeIn 0.5s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .justlive-chat-ended-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
      color: #4b5563;
    }
    
    .justlive-chat-ended-message {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
      line-height: 1.5;
    }
    
    .justlive-chat-restart {
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    
    .justlive-chat-restart:hover {
      background: #0061d5;
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .justlive-chat-error {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 320px;
      z-index: 10000;
      transform: translateY(150%);
      transition: transform 0.3s ease;
      border-left: 4px solid #ef4444;
    }
    
    .justlive-chat-error.show {
      transform: translateY(0);
    }
    
    .justlive-chat-error-close {
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #9ca3af;
      transition: color 0.2s ease;
    }
    
    .justlive-chat-error-close:hover {
      color: #4b5563;
    }
    
    .justlive-chat-error-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #ef4444;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .justlive-chat-error-content {
      color: #4b5563;
      font-size: 14px;
      line-height: 1.5;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    .justlive-chat-typing {
      background: #f3f4f6;
      color: #6b7280;
      padding: 10px;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      font-size: 12px;
      margin: 0;
      width: 60px;
      height: 30px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: opacity 0.3s ease;
    }
    
    .justlive-chat-typing::before,
    .justlive-chat-typing::after,
    .justlive-chat-typing .dot {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #6b7280;
      margin: 0 3px;
      opacity: 0.8;
    }
    
    .justlive-chat-typing::before {
      animation: pulse 1.2s infinite;
      animation-delay: 0s;
    }
    
    .justlive-chat-typing::after {
      animation: pulse 1.2s infinite;
      animation-delay: 0.6s;
    }
    
    .justlive-chat-typing .dot {
      animation: pulse 1.2s infinite;
      animation-delay: 0.3s;
    }
    
    .justlive-chat-typing-container {
      position: relative;
      margin-top: 8px;
      margin-bottom: 8px;
      align-self: flex-start;
      transition: all 0.3s ease;
    }

    .justlive-chat-restart-button {
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 12px;
      margin-top: 10px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .justlive-chat-restart-button:hover {
      background: #0061d5;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(styles);

  // Create error display
  const errorDisplay = document.createElement('div');
  errorDisplay.className = 'justlive-chat-error';
  errorDisplay.innerHTML = `
    <div class="justlive-chat-error-close">✕</div>
    <div class="justlive-chat-error-title"><span class="justlive-chat-error-icon">⚠️</span> <span class="justlive-chat-error-title-text">Error</span></div>
    <div class="justlive-chat-error-content"></div>
  `;
  document.body.appendChild(errorDisplay);

  // Error display functions
  const showError = (message, title = "Error") => {
    const errorTitle = errorDisplay.querySelector('.justlive-chat-error-title-text');
    const errorMessage = errorDisplay.querySelector('.justlive-chat-error-content');
    
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorDisplay.classList.add('show');
    
    // Add shake animation
    errorDisplay.style.animation = 'none';
    setTimeout(() => {
      errorDisplay.style.animation = 'slideIn 0.3s ease';
    }, 10);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      errorDisplay.classList.remove('show');
    }, 8000);
  };

  errorDisplay.querySelector('.justlive-chat-error-close').addEventListener('click', () => {
    errorDisplay.classList.remove('show');
  });

  // Create chat UI
  const container = document.createElement('div');
  container.className = 'justlive-chat-container';

  const button = document.createElement('div');
  button.className = 'justlive-chat-button';
  button.innerHTML = `
    <svg class="justlive-chat-icon" viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>
  `;

  const chatWindow = document.createElement('div');
  chatWindow.className = 'justlive-chat-window';
  chatWindow.innerHTML = `
    <div class="justlive-chat-header">
      <h3 class="justlive-chat-title">
        Chat with us
        <div class="justlive-chat-admin-status offline">
          <span class="justlive-chat-admin-status-dot"></span>
          <span class="justlive-chat-admin-status-text">Offline</span>
        </div>
      </h3>
      <div class="justlive-chat-close">✕</div>
    </div>
    <div class="justlive-chat-messages"></div>
    <div class="justlive-chat-input-container">
      <input type="text" class="justlive-chat-input" placeholder="Type a message...">
      <button class="justlive-chat-send">Send</button>
    </div>
  `;

  container.appendChild(button);
  container.appendChild(chatWindow);
  document.body.appendChild(container);

  // Socket.IO setup
  const script = document.createElement('script');
  script.src = 'https://cdn.socket.io/4.7.4/socket.io.min.js';
  script.onload = () => {
    console.log('Socket.IO script loaded');
    
    // Initialize socket with reconnection options
    const socket = io(BACKEND_URL, {
      auth: { websiteId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    let currentRoomId = null;
    let isConnected = false;
    let isChatEnded = false;
    let agentTyping = false;
    let isAdminOnline = false;
    let visitorInfo = {
      name: 'Visitor',
      email: ''
    };
    let hasSubmittedInfo = false;

    // Variable, um zu verfolgen, ob der Besucher bereits als "verlassen" gemeldet wurde
    let visitorLeftReported = false;

    // DOM elements
    const messagesContainer = chatWindow.querySelector('.justlive-chat-messages');
    const input = chatWindow.querySelector('.justlive-chat-input');
    const sendButton = chatWindow.querySelector('.justlive-chat-send');
    const inputContainer = chatWindow.querySelector('.justlive-chat-input-container');
    const adminStatus = chatWindow.querySelector('.justlive-chat-admin-status');
    const adminStatusText = adminStatus.querySelector('.justlive-chat-admin-status-text');
    const chatButton = document.querySelector('.justlive-chat-button');

    // Function to update admin status UI
    const updateAdminStatus = (isAdminOnline) => {
      console.log('Updating admin status UI:', isAdminOnline);
      
      if (adminStatus) {
        console.log('Admin status element found');
        if (isAdminOnline) {
          adminStatus.classList.remove('offline');
          adminStatus.classList.add('online');
          adminStatus.innerHTML = '<span class="justlive-chat-admin-status-dot"></span><span>Online</span>';
          
          // Add pulse effect to chat button
          chatButton.classList.add('admin-online');
        } else {
          adminStatus.classList.remove('online');
          adminStatus.classList.add('offline');
          adminStatus.innerHTML = '<span class="justlive-chat-admin-status-dot"></span><span>Offline</span>';
          
          // Remove pulse effect from chat button
          chatButton.classList.remove('admin-online');
        }
      } else {
        console.log('Admin status element not found');
      }
    };

    // Helper functions
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const addTimestamp = () => {
      const now = new Date();
      const timestampEl = document.createElement('div');
      timestampEl.className = 'justlive-chat-timestamp';
      timestampEl.textContent = formatTime(now);
      messagesContainer.appendChild(timestampEl);
    };

    const addSystemMessage = (message) => {
      // Create wrapper for message and timestamp
      const wrapperElement = document.createElement('div');
      wrapperElement.className = 'justlive-chat-message-wrapper system';
      
      // Create message element
      const messageEl = document.createElement('div');
      messageEl.className = 'justlive-chat-message system';
      messageEl.textContent = message;
      
      // Bei Systemnachrichten keine Zeitanzeige hinzufügen
      
      // Add message to wrapper
      wrapperElement.appendChild(messageEl);
      
      // Add wrapper to messages container
      messagesContainer.appendChild(wrapperElement);
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showChatEnded = () => {
      console.log('Showing chat ended message');
      
      // Set chat as ended
      isChatEnded = true;
      currentRoomId = null; // Reset room ID
      
      // Disable input
      input.disabled = true;
      sendButton.disabled = true;
      
      // Hide typing indicator
      agentTyping = false;
      updateTypingIndicator();
      
      // Check if there's already an ended message
      if (messagesContainer.querySelector('.justlive-chat-ended')) {
        console.log('Chat ended message already exists, not adding another one');
        return;
      }
      
      // Create and add ended message
      const endedEl = document.createElement('div');
      endedEl.className = 'justlive-chat-ended';
      endedEl.innerHTML = `
        <div class="justlive-chat-ended-title">Chat session ended</div>
        <div class="justlive-chat-ended-message">This chat session has been ended by the support agent.</div>
        <button class="justlive-chat-restart">Start new chat</button>
      `;
      messagesContainer.appendChild(endedEl);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Add event listener for restart button
      const restartButton = endedEl.querySelector('.justlive-chat-restart');
      if (restartButton) {
        restartButton.addEventListener('click', restartChat);
      }
    };

    const restartChat = () => {
      console.log('Restarting chat');
      
      // Clear previous chat
      messagesContainer.innerHTML = '';
      
      // Reset state
      isChatEnded = false;
      currentRoomId = null;
      hasSubmittedInfo = false; // Reset user info status
      visitorLeftReported = false; // Reset visitor left reported flag
      
      // Reset typing state
      agentTyping = false;
      
      // Disable input and send button until user starts chat again
      input.disabled = true;
      sendButton.disabled = true;
      inputContainer.style.display = 'none';
      
      // Stelle sicher, dass wir verbunden sind
      if (!isConnected) {
        console.log('Not connected, attempting to reconnect');
        // Versuche, die Verbindung wiederherzustellen
        socket.connect();
        
        // Warte kurz, bis die Verbindung hergestellt ist
        setTimeout(() => {
          if (socket.connected) {
            console.log('Reconnected successfully');
            isConnected = true;
            // Show welcome message
            showWelcomeMessage();
          } else {
            console.log('Failed to reconnect');
            // Falls die Verbindung nicht hergestellt werden konnte
            showError('Unable to connect to chat server. Please try again later.', 'Connection Failed');
          }
        }, 1000);
      } else {
        console.log('Already connected, showing welcome message');
        // Show welcome message
        showWelcomeMessage();
      }
    };

    // Create typing indicator element once
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'justlive-chat-typing';
    typingIndicator.style.display = 'none';
    
    // Add middle dot (the ::before and ::after pseudo-elements create the first and third dots)
    const dotEl = document.createElement('span');
    dotEl.className = 'dot';
    typingIndicator.appendChild(dotEl);
    
    // Create a container for the typing indicator
    const typingContainer = document.createElement('div');
    typingContainer.className = 'justlive-chat-typing-container';
    typingContainer.appendChild(typingIndicator);
    
    // Add to messages container
    messagesContainer.appendChild(typingContainer);
    
    function updateTypingIndicator() {
      if (agentTyping) {
        typingIndicator.style.display = 'flex';
        if (!messagesContainer.contains(typingContainer)) {
          messagesContainer.appendChild(typingContainer);
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } else {
        typingIndicator.style.display = 'none';
      }
    }

    // Show welcome message with start button
    const showWelcomeMessage = () => {
      console.log('Showing welcome message');
      messagesContainer.innerHTML = '';
      
      // Make sure input and send button are disabled
      input.disabled = true;
      sendButton.disabled = true;
      inputContainer.style.display = 'none';
      
      // Fetch current admin status before showing welcome message
      fetchAdminStatus((data) => {
        console.log('Admin status for welcome message:', data);
        const isAdminOnline = data.isAdminOnline;
        
        const welcomeEl = document.createElement('div');
        welcomeEl.className = 'justlive-chat-welcome';
        welcomeEl.innerHTML = `
          <div class="justlive-chat-welcome-title">Welcome to our live chat!</div>
          <div class="justlive-chat-welcome-message">
            Our team is ${isAdminOnline ? 'online and ready' : 'currently offline but will respond as soon as possible'}. Start a conversation by clicking the button below.
          </div>
          <button class="justlive-chat-start-button">Start Chat</button>
        `;
        messagesContainer.appendChild(welcomeEl);
        
        // Add typing container at the end
        messagesContainer.appendChild(typingContainer);
        
        // Add event listener for start button
        welcomeEl.querySelector('.justlive-chat-start-button').addEventListener('click', () => {
          showUserInfoForm();
        });
      });
    };
    
    // Show user info form
    const showUserInfoForm = () => {
      console.log('Showing user info form');
      messagesContainer.innerHTML = '';
      
      // Make sure chat input remains disabled until user submits email
      input.disabled = true;
      sendButton.disabled = true;
      inputContainer.style.display = 'none';
      
      const formEl = document.createElement('div');
      formEl.className = 'justlive-chat-user-form';
      formEl.innerHTML = `
        <div class="justlive-chat-form-title">Please provide your email</div>
        <div class="justlive-chat-form-field">
          <label class="justlive-chat-form-label" for="visitor-email">Email</label>
          <input type="email" id="visitor-email" class="justlive-chat-form-input" placeholder="Your email address">
          <div class="justlive-chat-form-error" id="email-error" style="display: none;">Please enter a valid email</div>
        </div>
        <button class="justlive-chat-form-submit">Start Chat</button>
      `;
      messagesContainer.appendChild(formEl);
      
      // Add typing container at the end
      messagesContainer.appendChild(typingContainer);
      
      // Add event listener for form submission
      const submitButton = formEl.querySelector('.justlive-chat-form-submit');
      const emailInput = formEl.querySelector('#visitor-email');
      const emailError = formEl.querySelector('#email-error');
      
      submitButton.addEventListener('click', () => {
        let isValid = true;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
          emailError.style.display = 'block';
          isValid = false;
        } else {
          emailError.style.display = 'none';
        }
        
        if (isValid) {
          console.log('User info form submitted successfully');
          visitorInfo.name = "Visitor"; // Default name
          visitorInfo.email = emailInput.value.trim();
          hasSubmittedInfo = true;
          
          // Initialize chat after user submits info
          initializeChat();
        }
      });
      
      // Focus on email input
      emailInput.focus();
    };
    
    // Function to initialize chat
    const initializeChat = () => {
      console.log('Initializing chat...');
      
      // Reset visitor left reported flag
      visitorLeftReported = false;
      
      // Clear messages container
      messagesContainer.innerHTML = '';
      
      // Add welcome message
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'justlive-chat-welcome-message';
      welcomeMessage.style.backgroundColor = '#f0f9ff';
      welcomeMessage.style.color = '#0c4a6e';
      welcomeMessage.style.alignSelf = 'center';
      welcomeMessage.style.textAlign = 'center';
      welcomeMessage.style.maxWidth = '90%';
      welcomeMessage.style.borderRadius = '12px';
      welcomeMessage.style.marginBottom = '16px';
      welcomeMessage.style.marginTop = '8px';
      welcomeMessage.style.padding = '10px 15px';
      welcomeMessage.textContent = 'Connecting to chat...';
      messagesContainer.appendChild(welcomeMessage);
      
      // Enable input and send button
      input.disabled = false;
      sendButton.disabled = false;
      
      // Show input container
      inputContainer.style.display = 'flex';
      
      // Focus on input
      input.focus();
      
      // Emit join event
      console.log('Emitting chat:join event with visitor info:', hasSubmittedInfo ? visitorInfo : null);
      socket.emit('chat:join', {
        websiteId,
        visitorInfo: hasSubmittedInfo ? visitorInfo : null
      });
      
      // Fetch admin status after a short delay to ensure socket connection
      setTimeout(() => {
        fetchAdminStatus((data) => {
          console.log('Admin status received in initializeChat:', data);
          // The welcome message will be updated by handleAdminStatusResponse
        });
      }, 1000);
    };

    // Event handlers
    button.addEventListener('click', () => {
      if (!isConnected) {
        // Versuche, die Verbindung wiederherzustellen, wenn der Chat beendet wurde
        if (isChatEnded) {
          socket.connect();
          
          // Warte kurz, bis die Verbindung hergestellt ist
          setTimeout(() => {
            if (socket.connected) {
              isConnected = true;
              chatWindow.classList.add('open');
              // Starte einen neuen Chat
              restartChat();
            } else {
              showError('Chat is currently unavailable. Please try again later.', 'Connection Error');
            }
          }, 1000);
          return;
        } else {
          showError('Chat is currently unavailable. Please try again later.', 'Connection Error');
          return;
        }
      }
      
      // Toggle chat window open/closed state
      if (chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
      } else {
        chatWindow.classList.add('open');
        
        // Request admin status when chat window opens
        requestAdminStatus();
        
        // Show welcome message if no chat is active
        if (!currentRoomId && !isChatEnded) {
          // Always show welcome message first, unless user has already submitted info
          if (!hasSubmittedInfo) {
            // Disable input and send button until user starts chat
            input.disabled = true;
            sendButton.disabled = true;
            inputContainer.style.display = 'none';
            
            // Show welcome message instead of user info form
            showWelcomeMessage();
          } else {
            // Only initialize chat if it hasn't been initialized yet
            if (messagesContainer.children.length === 0) {
              console.log('Initializing chat because messages container is empty');
              initializeChat();
            } else {
              console.log('Messages container already has content, not initializing chat');
              // Check if we need to update the welcome message
              const welcomeMessage = messagesContainer.querySelector('.justlive-chat-welcome-message');
              if (!welcomeMessage) {
                console.log('No welcome message found, fetching admin status to create one');
                fetchAdminStatus((data) => {
                  console.log('Admin status received for welcome message update:', data);
                });
              }
            }
          }
        }
        
        // Focus on input if available
        if (input && !input.disabled) {
          input.focus();
        }
      }
    });

    chatWindow.querySelector('.justlive-chat-close').addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('open');
    });

    const sendMessage = () => {
      const content = input.value.trim();
      
      if (!content) return;
      
      // If we don't have a room ID yet but the chat is initialized
      if (!currentRoomId && !isChatEnded) {
        console.log('No room ID yet, but chat is initialized');
        
        // If user hasn't submitted info yet, show the form
        if (!hasSubmittedInfo) {
          console.log('User has not submitted info, showing form');
          showUserInfoForm();
          return;
        }
        
        console.log('Waiting for room ID to be established...');
        
        // Add a temporary message to show the user their message was received
        const tempMessage = document.createElement('div');
        tempMessage.className = 'justlive-chat-message justlive-chat-visitor-message';
        tempMessage.style.alignSelf = 'flex-end';
        tempMessage.style.backgroundColor = '#0070f3';
        tempMessage.style.color = 'white';
        tempMessage.textContent = content;
        messagesContainer.appendChild(tempMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Clear input
        input.value = '';
        
        // Make sure we're connected to the chat
        if (!socket.connected) {
          console.log('Socket not connected, reconnecting...');
          socket.connect();
        }
        
        // Re-emit join event to ensure we get a room ID
        socket.emit('chat:join', {
          websiteId,
          visitorInfo: hasSubmittedInfo ? visitorInfo : undefined
        });
        
        // Store the message to send once we have a room ID
        const messageToSend = content;
        
        // Set up a one-time event handler for the joined event
        socket.once('chat:joined', (data) => {
          console.log('Joined chat room after sending message:', data.roomId);
          currentRoomId = data.roomId;
          
          // Send the message now that we have a room ID
          setTimeout(() => {
            socket.emit('chat:message', { 
              content: messageToSend, 
              roomId: currentRoomId,
              visitorInfo: hasSubmittedInfo ? visitorInfo : undefined
            });
          }, 500);
        });
        
        return;
      }
      
      // Normal case: we have a room ID
      if (currentRoomId && !isChatEnded) {
        console.log('Sending message to room:', currentRoomId);
        
        // Send message to server
        socket.emit('chat:message', { 
          content, 
          roomId: currentRoomId,
          visitorInfo: hasSubmittedInfo ? visitorInfo : undefined
        });
        
        // Clear input
        input.value = '';
        
        // Focus input
        input.focus();
      } else if (isChatEnded) {
        console.log('Chat has ended, cannot send message');
        showError('This chat has ended. Please start a new chat to continue.', 'Chat Ended');
        input.value = '';
      }
    };

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Socket event handlers
    socket.on('connect', () => {
      console.log('Connected to chat server');
      isConnected = true;
      
      // Aktiviere den Chat-Button, wenn er deaktiviert war
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
    });

    socket.on('chat:joined', (data) => {
      console.log('Joined chat room:', data.roomId);
      currentRoomId = data.roomId;
      
      // Stelle sicher, dass der Chat aktiv ist
      isChatEnded = false;
      input.disabled = false;
      sendButton.disabled = false;
      isConnected = true;
      
      // Stelle sicher, dass der Chat-Container leer ist, wenn wir einen neuen Chat starten
      if (messagesContainer.children.length === 0) {
        addTimestamp();
      }
      
      // Enable input if it was disabled
      input.disabled = false;
      sendButton.disabled = false;
    });

    socket.on('connect_error', (error) => {
      isConnected = false;
      console.error('JustLive Chat: Connection error:', error);
      
      // Update UI to show connection error
      updateConnectionStatus(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      isConnected = false;
      
      // Deaktiviere den Chat-Button
      button.style.opacity = '0.7';
      button.style.pointerEvents = 'none';
      
      if (chatWindow.classList.contains('open') && !isChatEnded) {
        showError('Connection to chat server lost. We\'re trying to reconnect you...', 'Connection Lost');
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to chat server after', attemptNumber, 'attempts');
      isConnected = true;
      
      // Re-enable button on reconnect
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
      
      // Hide error message if it was shown
      hideError();
      
      // If chat window is open, try to rejoin the room
      if (chatWindow.classList.contains('open') && !isChatEnded) {
        socket.emit('chat:join', {
          websiteId,
          visitorInfo: hasSubmittedInfo ? visitorInfo : null
        });
      }
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Attempting to reconnect:', attemptNumber);
    });
    
    socket.on('reconnect_error', (error) => {
      console.error('JustLive Chat: Reconnection error:', error);
    });
    
    socket.on('reconnect_failed', () => {
      console.error('JustLive Chat: Failed to reconnect to chat server');
      showError('Could not connect to chat server. Please try again later.', 'Connection Error');
    });

    socket.on('chat:message', (message) => {
      // Clear typing indicator when message arrives
      if (!message.isVisitor) {
        agentTyping = false;
        updateTypingIndicator();
      }
      
      // Create wrapper for message and timestamp
      const wrapperElement = document.createElement('div');
      wrapperElement.className = `justlive-chat-message-wrapper ${
        message.isVisitor ? 'visitor' : 'agent'
      }`;
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = `justlive-chat-message ${
        message.isVisitor ? 'visitor' : 'agent'
      }`;
      messageElement.textContent = message.content;
      
      // Create timestamp element
      const timeElement = document.createElement('div');
      timeElement.className = 'justlive-chat-message-time';
      timeElement.textContent = formatTime(new Date());
      
      // Add message and timestamp to wrapper
      wrapperElement.appendChild(messageElement);
      wrapperElement.appendChild(timeElement);
      
      // Entferne den Typing-Container vorübergehend, wenn er vorhanden ist
      const hasTypingContainer = messagesContainer.contains(typingContainer);
      if (hasTypingContainer) {
        messagesContainer.removeChild(typingContainer);
      }
      
      // Add wrapper to messages container
      messagesContainer.appendChild(wrapperElement);
      
      // Füge den Typing-Container wieder hinzu, wenn er vorher vorhanden war und der Agent tippt
      if (hasTypingContainer && agentTyping) {
        messagesContainer.appendChild(typingContainer);
      }
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    socket.on('chat:error', (error) => {
      console.error('JustLive Chat: Chat error:', error.message);
      showError(error.message);
    });

    socket.on('chat:session:end', () => {
      console.log('Chat session ended by agent');
      // Only show ended message if the chat hasn't already been marked as ended
      if (!isChatEnded) {
        showChatEnded();
      }
    });

    socket.on('chat:participant:status', (data) => {
      // Only show typing indicator if the message is from an admin
      if (data.sessionId !== socket.id && data.isAdmin) {
        // Update admin online status
        updateAdminStatus(data.isOnline);
        
        // Update typing status
        agentTyping = data.isTyping;
        updateTypingIndicator();
      }
    });

    // Add handler for chat room deleted
    socket.on('chat:room:deleted', () => {
      console.log('Chat room deleted by agent');
      
      // Only proceed if the chat hasn't already been marked as ended
      if (!isChatEnded) {
        // Clear the chat
        messagesContainer.innerHTML = '';
        
        // Reset state
        currentRoomId = null;
        isChatEnded = true;
        input.disabled = true;
        sendButton.disabled = true;
        
        // Reset typing state
        agentTyping = false;
        
        // Show deleted message
        const deletedEl = document.createElement('div');
        deletedEl.className = 'justlive-chat-ended';
        deletedEl.innerHTML = `
          <div class="justlive-chat-ended-title">Chat session deleted</div>
          <div class="justlive-chat-ended-message">This chat session has been deleted by the support agent.</div>
          <button class="justlive-chat-restart">Start new chat</button>
        `;
        messagesContainer.appendChild(deletedEl);
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add event listener for restart button
        const restartButton = deletedEl.querySelector('.justlive-chat-restart');
        if (restartButton) {
          restartButton.addEventListener('click', restartChat);
        }
      }
    });

    // Handle typing events
    let typingTimeout;
    input.addEventListener('input', () => {
      if (currentRoomId && !isChatEnded) {
        clearTimeout(typingTimeout);
        socket.emit('chat:typing', { roomId: currentRoomId, isTyping: true });
        typingTimeout = setTimeout(() => {
          socket.emit('chat:typing', { roomId: currentRoomId, isTyping: false });
        }, 1000);
      }
    });
    
    // Disable button until connected
    if (!isConnected) {
      button.style.opacity = '0.5';
      button.style.pointerEvents = 'none';
      
      // Re-enable once connected is handled by the main connect event handler above
    }

    // Track page visibility and unload
    window.addEventListener('beforeunload', () => {
      if (currentRoomId && !isChatEnded && !visitorLeftReported) {
        // Markieren, dass der Besucher als "verlassen" gemeldet wurde
        visitorLeftReported = true;
        
        // Nur sendBeacon verwenden, um doppelte Nachrichten zu vermeiden
        // Socket-Event entfernen, da es zu doppelten Nachrichten führt
        // socket.emit('chat:visitor:leave', { roomId: currentRoomId });
        
        // SendBeacon für zuverlässige Übertragung während des Entladens der Seite
        if (navigator.sendBeacon) {
          const data = JSON.stringify({ roomId: currentRoomId });
          const blob = new Blob([data], { type: 'application/json' });
          navigator.sendBeacon(`${BACKEND_URL}/chat/visitor-left`, blob);
        } else {
          // Fallback für Browser ohne sendBeacon-Unterstützung
          try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${BACKEND_URL}/chat/visitor-left`, false); // Synchroner Aufruf
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ roomId: currentRoomId }));
          } catch (e) {
            console.error('JustLive Chat: Failed to send visitor-left notification:', e);
          }
        }
      }
    });

    // Function to request admin status
    const requestAdminStatus = () => {
      // Only request if we're connected
      if (socket.connected) {
        // Use fetchAdminStatus to get the admin status and handle the response
        fetchAdminStatus((data) => {
          console.log('Admin status received:', data);
        });
      } else {
        console.log('Socket not connected, cannot request admin status');
      }
    };

    // Function to fetch admin status
    const fetchAdminStatus = (callback) => {
      console.log('Fetching admin status...');
      
      // Remove any existing event listeners to avoid duplicates
      socket.off('chat:admin:status');
      
      // Set up a one-time event handler for admin status
      socket.once('chat:admin:status', (data) => {
        console.log('Received admin status:', data);
        clearTimeout(timeoutId);
        handleAdminStatusResponse(data);
        if (callback) callback(data);
      });
      
      // Request admin status
      if (socket.connected) {
        console.log('Socket connected, requesting admin status');
        socket.emit('chat:admin:status:request', { websiteId });
      } else {
        console.log('Socket not connected, connecting...');
        socket.connect();
        setTimeout(() => {
          if (socket.connected) {
            console.log('Socket connected after reconnect, requesting admin status');
            socket.emit('chat:admin:status:request', { websiteId });
          } else {
            console.log('Failed to connect socket');
            if (callback) callback({ isAdminOnline: false });
          }
        }, 1000);
      }
      
      // Set a timeout in case we don't get a response
      const timeoutId = setTimeout(() => {
        console.log('Admin status request timed out');
        socket.off('chat:admin:status');
        if (callback) callback({ isAdminOnline: false });
      }, 5000); // Increase timeout to 5 seconds
    };

    // Function to handle admin status response
    const handleAdminStatusResponse = (data) => {
      console.log('Handling admin status response:', data);
      const isAdminOnline = data.isAdminOnline;
      
      // Update UI
      updateAdminStatus(isAdminOnline);
      
      // Update welcome message based on admin status
      if (messagesContainer) {
        // Don't update welcome message if user info form is showing
        if (messagesContainer.querySelector('.justlive-chat-user-form')) {
          console.log('User info form is showing, not updating welcome message');
          return;
        }
        
        const welcomeMessage = messagesContainer.querySelector('.justlive-chat-welcome-message');
        if (welcomeMessage) {
          console.log('Updating welcome message with admin status:', isAdminOnline);
          if (isAdminOnline) {
            welcomeMessage.textContent = 'Our team is online and ready to help you!';
          } else {
            welcomeMessage.textContent = 'Our team is currently offline. Leave a message and we\'ll get back to you soon.';
          }
        } else {
          console.log('Welcome message element not found');
          
          // Create welcome message if it doesn't exist and user has submitted info
          if (hasSubmittedInfo && !messagesContainer.querySelector('.justlive-chat-user-info-form')) {
            console.log('Creating new welcome message');
            
            const newWelcomeMessage = document.createElement('div');
            newWelcomeMessage.className = 'justlive-chat-welcome-message';
            newWelcomeMessage.style.backgroundColor = '#f0f9ff';
            newWelcomeMessage.style.color = '#0c4a6e';
            newWelcomeMessage.style.alignSelf = 'center';
            newWelcomeMessage.style.textAlign = 'center';
            newWelcomeMessage.style.maxWidth = '90%';
            newWelcomeMessage.style.borderRadius = '12px';
            newWelcomeMessage.style.marginBottom = '16px';
            newWelcomeMessage.style.marginTop = '8px';
            newWelcomeMessage.style.padding = '10px 15px';
            
            if (isAdminOnline) {
              newWelcomeMessage.textContent = 'Our team is online and ready to help you!';
            } else {
              newWelcomeMessage.textContent = 'Our team is currently offline. Leave a message and we\'ll get back to you soon.';
            }
            
            // Add to beginning of messages container
            if (messagesContainer.firstChild) {
              messagesContainer.insertBefore(newWelcomeMessage, messagesContainer.firstChild);
            } else {
              messagesContainer.appendChild(newWelcomeMessage);
            }
            console.log('Added new welcome message');
          }
        }
      } else {
        console.log('Messages container not found');
      }
    };
  };

  document.head.appendChild(script);
})(); 