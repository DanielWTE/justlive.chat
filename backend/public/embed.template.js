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
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .justlive-chat-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 118, 255, 0.23);
    }

    .justlive-chat-icon {
      width: 30px;
      height: 30px;
      fill: white;
    }

    .justlive-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideIn 0.3s ease;
    }

    .justlive-chat-window.open {
      display: flex;
    }

    .justlive-chat-header {
      padding: 16px;
      background: #fafafa;
      border-bottom: 1px solid #eaeaea;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .justlive-chat-title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      margin: 0;
    }

    .justlive-chat-close {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .justlive-chat-close:hover {
      opacity: 1;
    }

    .justlive-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .justlive-chat-input-container {
      padding: 16px;
      border-top: 1px solid #eaeaea;
      display: flex;
      gap: 8px;
    }

    .justlive-chat-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #eaeaea;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .justlive-chat-input:focus {
      border-color: #0070f3;
    }

    .justlive-chat-send {
      padding: 8px 16px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .justlive-chat-send:hover {
      background: #0061d5;
    }

    .justlive-chat-message {
      margin-bottom: 12px;
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
    }

    .justlive-chat-message.visitor {
      background: #0070f3;
      color: white;
      margin-left: auto;
    }

    .justlive-chat-message.agent {
      background: #f5f5f5;
      color: #000;
    }

    .justlive-chat-error {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      background: #fee2e2;
      border: 1px solid #ef4444;
      color: #991b1b;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: none;
      animation: slideIn 0.3s ease;
      z-index: 10000;
    }

    .justlive-chat-error.show {
      display: block;
    }

    .justlive-chat-error-close {
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      opacity: 0.6;
      font-size: 18px;
      padding: 4px;
    }

    .justlive-chat-error-close:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styles);

  // Create error display
  const errorDisplay = document.createElement('div');
  errorDisplay.className = 'justlive-chat-error';
  errorDisplay.innerHTML = `
    <div class="justlive-chat-error-close">✕</div>
    <div class="justlive-chat-error-message"></div>
  `;
  document.body.appendChild(errorDisplay);

  // Error display functions
  const showError = (message) => {
    const errorMessage = errorDisplay.querySelector('.justlive-chat-error-message');
    errorMessage.textContent = message;
    errorDisplay.classList.add('show');
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      errorDisplay.classList.remove('show');
    }, 10000);
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

    // DOM elements
    const messagesContainer = chatWindow.querySelector('.justlive-chat-messages');
    const input = chatWindow.querySelector('.justlive-chat-input');
    const sendButton = chatWindow.querySelector('.justlive-chat-send');

    // Event handlers
    button.addEventListener('click', () => {
      if (!isConnected) {
        showError('Chat is currently unavailable. Please try again later.');
        return;
      }
      chatWindow.classList.add('open');
      if (!currentRoomId) {
        socket.emit('chat:join', { websiteId });
      }
    });

    chatWindow.querySelector('.justlive-chat-close').addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('open');
    });

    const sendMessage = () => {
      const content = input.value.trim();
      if (content && currentRoomId) {
        socket.emit('chat:message', { content, roomId: currentRoomId });
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
    });

    socket.on('chat:joined', (data) => {
      console.log('Joined chat room:', data.roomId);
      currentRoomId = data.roomId;
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      isConnected = false;
      if (error.message.includes('Authentication failed: Domain mismatch')) {
        showError('This chat widget is not authorized for this domain. Please check your configuration.');
      } else if (error.message.includes('Too many connections')) {
        showError('Too many chat connections from this domain. Please try again later.');
      } else {
        showError('Unable to connect to chat server. Please try again later.');
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      isConnected = false;
      currentRoomId = null;
      if (chatWindow.classList.contains('open')) {
        showError('Connection lost. Trying to reconnect...');
      }
    });

    socket.on('chat:message', (message) => {
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
      showError(error.message);
    });

    // Handle typing events
    let typingTimeout;
    input.addEventListener('input', () => {
      if (currentRoomId) {
        clearTimeout(typingTimeout);
        socket.emit('chat:typing', { roomId: currentRoomId, isTyping: true });
        typingTimeout = setTimeout(() => {
          socket.emit('chat:typing', { roomId: currentRoomId, isTyping: false });
        }, 1000);
      }
    });
  };

  document.head.appendChild(script);
})(); 