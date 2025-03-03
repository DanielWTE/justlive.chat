(() => {
  // Configuration
  const BACKEND_URL = '{{BACKEND_URL}}';

  // Get website ID from script tag
  const currentScript = document.currentScript;
  const websiteId = new URL(currentScript.src).searchParams.get('id');

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
    }

    .justlive-chat-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 118, 255, 0.23);
    }
    
    .justlive-chat-button:active {
      transform: translateY(0) scale(0.95);
    }

    .justlive-chat-icon {
      width: 30px;
      height: 30px;
      fill: white;
      transition: transform 0.3s ease;
    }
    
    .justlive-chat-button:hover .justlive-chat-icon {
      transform: rotate(10deg);
    }

    .justlive-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid #eaeaea;
      transform-origin: bottom right;
    }

    .justlive-chat-window.open {
      display: flex;
    }

    .justlive-chat-header {
      padding: 16px;
      background: #f9fafb;
      border-bottom: 1px solid #eaeaea;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .justlive-chat-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .justlive-chat-close {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s ease;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f3f4f6;
    }

    .justlive-chat-close:hover {
      opacity: 1;
      background: #e5e7eb;
    }

    .justlive-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #ffffff;
      scroll-behavior: smooth;
    }

    .justlive-chat-input-container {
      padding: 16px;
      border-top: 1px solid #eaeaea;
      display: flex;
      gap: 8px;
      background: #f9fafb;
    }

    .justlive-chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;
      background: #ffffff;
    }

    .justlive-chat-input:focus {
      border-color: #0070f3;
      box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
    }

    .justlive-chat-send {
      padding: 10px 16px;
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
    }

    .justlive-chat-send:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }

    .justlive-chat-message {
      margin-bottom: 12px;
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
      animation: messageIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    .justlive-chat-message:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    @keyframes messageIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .justlive-chat-message.visitor {
      background: #0070f3;
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 4px;
    }

    .justlive-chat-message.agent {
      background: #f3f4f6;
      color: #111827;
      border-bottom-left-radius: 4px;
    }

    .justlive-chat-message.system {
      background: #f3f4f6;
      color: #6b7280;
      margin: 12px auto;
      text-align: center;
      max-width: 85%;
      font-size: 12px;
      border-radius: 8px;
      animation: fadeIn 0.4s ease;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      box-shadow: none;
      font-style: italic;
      opacity: 0.9;
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

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
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
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin: 8px 0 8px 10px;
      max-width: 120px;
      position: relative;
      animation: fadeIn 0.3s ease;
      display: flex;
      align-items: center;
      font-style: italic;
    }
    
    .justlive-chat-typing::after {
      content: '...';
      display: inline-block;
      width: 12px;
      text-align: left;
      animation: ellipsis 1.5s infinite;
      margin-left: 4px;
    }
    
    @keyframes ellipsis {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
      100% { content: '.'; }
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
      <h3 class="justlive-chat-title">Chat with us</h3>
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
    const socket = io(BACKEND_URL, {
      auth: { websiteId },
    });

    let currentRoomId = null;
    let isConnected = false;
    let isChatEnded = false;
    let agentTyping = false;

    // DOM elements
    const messagesContainer = chatWindow.querySelector('.justlive-chat-messages');
    const input = chatWindow.querySelector('.justlive-chat-input');
    const sendButton = chatWindow.querySelector('.justlive-chat-send');

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
      const messageEl = document.createElement('div');
      messageEl.className = 'justlive-chat-message system';
      messageEl.textContent = message;
      messagesContainer.appendChild(messageEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const showChatEnded = () => {
      isChatEnded = true;
      input.disabled = true;
      sendButton.disabled = true;
      
      const endedEl = document.createElement('div');
      endedEl.className = 'justlive-chat-ended';
      endedEl.innerHTML = `
        <div class="justlive-chat-ended-title">Chat session ended</div>
        <div class="justlive-chat-ended-message">This chat session has been ended by the support agent.</div>
        <button class="justlive-chat-restart">Start new chat</button>
      `;
      messagesContainer.appendChild(endedEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      endedEl.querySelector('.justlive-chat-restart').addEventListener('click', () => {
        restartChat();
      });
    };

    const restartChat = () => {
      // Clear previous chat
      messagesContainer.innerHTML = '';
      isChatEnded = false;
      currentRoomId = null; // Reset room ID
      input.disabled = false;
      sendButton.disabled = false;
      
      // Start new chat session
      socket.emit('chat:join', { websiteId });
      addSystemMessage('Starting new chat session');
      
      // Add a small delay to ensure the UI updates
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
    };

    const updateTypingIndicator = () => {
      // Remove existing indicator if any
      const existingIndicator = messagesContainer.querySelector('.justlive-chat-typing');
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      // Add new indicator if agent is typing
      if (agentTyping) {
        const typingEl = document.createElement('div');
        typingEl.className = 'justlive-chat-typing';
        typingEl.textContent = 'Agent is typing';
        messagesContainer.appendChild(typingEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    };

    // Show welcome message with start button
    const showWelcomeMessage = () => {
      messagesContainer.innerHTML = '';
      
      const welcomeEl = document.createElement('div');
      welcomeEl.className = 'justlive-chat-welcome';
      welcomeEl.innerHTML = `
        <div class="justlive-chat-welcome-title">Welcome to our chat!</div>
        <div class="justlive-chat-welcome-message">
          Need help? Our team is here to assist you. Start a conversation by clicking the button below or typing a message.
        </div>
        <button class="justlive-chat-start-button">Start Chat</button>
      `;
      messagesContainer.appendChild(welcomeEl);
      
      // Add event listener for start button
      welcomeEl.querySelector('.justlive-chat-start-button').addEventListener('click', () => {
        initializeChat();
      });
    };
    
    // Initialize chat
    const initializeChat = () => {
      if (!currentRoomId && !isChatEnded) {
        // Clear any welcome message
        messagesContainer.innerHTML = '';
        socket.emit('chat:join', { websiteId });
        addSystemMessage('Connecting to support');
      }
    };

    // Event handlers
    button.addEventListener('click', () => {
      if (!isConnected) {
        showError('Chat is currently unavailable. Please try again later.', 'Connection Error');
        return;
      }
      chatWindow.classList.add('open');
      
      // Show welcome message if no chat is active
      if (!currentRoomId && !isChatEnded) {
        showWelcomeMessage();
      }
    });

    chatWindow.querySelector('.justlive-chat-close').addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('open');
    });

    const sendMessage = () => {
      const content = input.value.trim();
      
      if (!content) return;
      
      if (!currentRoomId && !isChatEnded) {
        // Initialize chat if this is the first message
        initializeChat();
        
        // We'll queue this message to be sent once the room is created
        setTimeout(() => {
          if (currentRoomId) {
            socket.emit('chat:message', { content, roomId: currentRoomId });
            // Don't create message element here - the socket event will handle it
          }
        }, 1000); // Give the server a second to create the room
        
        input.value = '';
      } else if (currentRoomId && !isChatEnded) {
        socket.emit('chat:message', { content, roomId: currentRoomId });
        
        // Don't create message element here - the socket event will handle it
        input.value = '';
        
        // Add timestamp every 5 messages or if it's been a while
        if (messagesContainer.querySelectorAll('.justlive-chat-message').length % 5 === 0) {
          addTimestamp();
        }
      } else if (isChatEnded) {
        showError('This chat has ended. Please start a new chat to continue.', 'Chat Ended');
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
    });

    socket.on('chat:joined', (data) => {
      console.log('Joined chat room:', data.roomId);
      currentRoomId = data.roomId;
      addSystemMessage('Connected to support');
      addTimestamp();
      
      // Enable input if it was disabled
      input.disabled = false;
      sendButton.disabled = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      isConnected = false;
      if (error.message.includes('Authentication failed: Domain mismatch')) {
        showError('This chat widget is not authorized for this domain. Please check your configuration.', 'Authentication Error');
      } else if (error.message.includes('Too many connections')) {
        showError('Too many chat connections from this domain. Please try again later.', 'Connection Limit');
      } else {
        showError('Unable to connect to chat server. Please try again later.', 'Connection Failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      isConnected = false;
      if (chatWindow.classList.contains('open')) {
        showError('Connection to chat server lost. We\'re trying to reconnect you...', 'Connection Lost');
      }
    });

    socket.on('chat:message', (message) => {
      // Clear typing indicator when message arrives
      if (!message.isVisitor) {
        agentTyping = false;
        updateTypingIndicator();
      }
      
      const messageElement = document.createElement('div');
      messageElement.className = `justlive-chat-message ${
        message.isVisitor ? 'visitor' : 'agent'
      }`;
      messageElement.textContent = message.content;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    socket.on('chat:error', (error) => {
      console.error('Chat error:', error.message);
      showError(error.message, 'Chat Error');
    });

    socket.on('chat:session:end', () => {
      console.log('Chat session ended by agent');
      showChatEnded();
    });

    socket.on('chat:typing', (data) => {
      if (!data.isVisitor) {
        agentTyping = data.isTyping;
        updateTypingIndicator();
      }
    });

    // Add handler for chat room deleted
    socket.on('chat:room:deleted', () => {
      console.log('Chat room deleted by agent');
      
      // Clear the chat
      messagesContainer.innerHTML = '';
      
      // Reset state
      currentRoomId = null;
      isChatEnded = true;
      input.disabled = true;
      sendButton.disabled = true;
      
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
      deletedEl.querySelector('.justlive-chat-restart').addEventListener('click', restartChat);
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
    
    // Focus input when chat window opens
    chatWindow.addEventListener('transitionend', () => {
      if (chatWindow.classList.contains('open')) {
        input.focus();
      }
    });
    
    // Add click event to focus input when clicking anywhere in the messages container
    messagesContainer.addEventListener('click', () => {
      if (!input.disabled) {
        input.focus();
      }
    });
    
    // Initialize the chat window state
    if (isConnected) {
      // If we're already connected, make sure the button is enabled
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
    } else {
      // If not connected, disable the button until connection is established
      button.style.opacity = '0.7';
      button.style.pointerEvents = 'none';
      
      // Re-enable once connected
      socket.on('connect', () => {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
      });
    }

    // Track page visibility and unload
    window.addEventListener('beforeunload', () => {
      if (currentRoomId && !isChatEnded) {
        // Inform server that user is leaving
        socket.emit('chat:visitor:leave', { roomId: currentRoomId });
        // Use sendBeacon for more reliable delivery during page unload
        if (navigator.sendBeacon) {
          const data = JSON.stringify({ roomId: currentRoomId });
          navigator.sendBeacon(`${BACKEND_URL}/chat/visitor-left`, data);
        }
      }
    });
  };

  document.head.appendChild(script);
})(); 