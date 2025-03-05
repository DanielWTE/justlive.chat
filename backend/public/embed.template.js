(() => {
  /**
   * JustLive Chat Widget
   * 
   * Configuration options:
   * - id: Website ID (required)
   * - debug: Enable debug mode (optional, default: false)
   * - language: Language code (optional, default: browser language, supported: 'en', 'de')
   * - colorPreset: Color preset name (optional, default: 'blue')
   * 
   * Available color presets:
   * - blue (default): Blue theme with matching pulse animation
   * - green: Green theme with matching pulse animation
   * - purple: Purple theme with matching pulse animation
   * - red: Red theme with matching pulse animation
   * - orange: Orange theme with matching pulse animation
   * - dark: Dark theme with matching pulse animation
   * 
   * Usage:
   * <script src="https://api.justlive.chat/embed.js?id=YOUR_WEBSITE_ID&colorPreset=blue"></script>
   * 
   * JavaScript API:
   * - JustLiveChat.getColorPresets(): Returns array of available color preset names
   * - JustLiveChat.setColorPreset(presetName): Changes the color preset
   * - JustLiveChat.setLanguage(language): Changes the language ('en' or 'de')
   * - JustLiveChat.toggleDebug(enable): Toggles debug mode
   */

  // Configuration
  const BACKEND_URL = '{{BACKEND_URL}}'; // Dynamically set in the api generation

  // Get website ID, debug mode, language and primary color from script tag
  const currentScript = document.currentScript;
  const scriptUrl = new URL(currentScript.src);
  const websiteId = scriptUrl.searchParams.get('id');
  let debugMode = scriptUrl.searchParams.get('debug') === 'true';
  
  // Define color presets with matching text and background colors
  const COLOR_PRESETS = {
    blue: {
      primary: '#1E88E5',
      pulseBackground: 'rgba(30, 136, 229, 0.4)',
      hoverBackground: '#1976D2',
      textColor: 'white',
    },
    green: {
      primary: '#43A047',
      pulseBackground: 'rgba(67, 160, 71, 0.4)',
      hoverBackground: '#388E3C',
      textColor: 'white',
    },
    purple: {
      primary: '#9C27B0',
      pulseBackground: 'rgba(156, 39, 176, 0.4)',
      hoverBackground: '#8E24AA',
      textColor: 'white',
    },
    red: {
      primary: '#E53935',
      pulseBackground: 'rgba(229, 57, 53, 0.4)',
      hoverBackground: '#D32F2F',
      textColor: 'white',
    },
    orange: {
      primary: '#F57C00',
      pulseBackground: 'rgba(245, 124, 0, 0.4)',
      hoverBackground: '#EF6C00',
      textColor: 'white',
    },
    dark: {
      primary: '#111827',
      pulseBackground: 'rgba(55, 65, 81, 0.4)',
      hoverBackground: '#374151',
      textColor: 'white',
    }
  };
  
  // Get preset name from script tag or use default (blue)
  const presetName = scriptUrl.searchParams.get('colorPreset') || 'blue';
  const selectedPreset = COLOR_PRESETS[presetName] || COLOR_PRESETS.blue;
  
  // Get primary color from the selected preset
  const primaryColor = selectedPreset.primary;
  
  // Get language from script tag or use browser language
  const configLanguage = scriptUrl.searchParams.get('language');
  const browserLanguage = navigator.language || navigator.userLanguage;
  const isGerman = configLanguage === 'de' || (!configLanguage && browserLanguage.startsWith('de'));
  
  // Translations
  const translations = {
    en: {
      connecting: 'Connecting to chat...',
      teamOnline: 'Our team is online and ready to help you!',
      teamOffline: 'Our team is currently offline. Leave a message and we\'ll get back to you soon.',
      typeMessage: 'Type a message...',
      yourEmail: 'Your email address',
      emailExplanation: 'We need your email address to contact you if the conversation is interrupted.',
      submitEmail: 'Submit',
      emailRequired: 'Email is required',
      invalidEmail: 'Please enter a valid email',
      skipEmail: 'Skip email input',
      startNewChat: 'Start a new chat',
      online: 'Online',
      offline: 'Offline',
      error: 'Error',
      connectionError: 'JustLive Chat: Connection error. Please try again later.',
      reconnectionError: 'JustLive Chat: Reconnection error. Please refresh the page.',
      chatError: 'JustLive Chat: An error occurred in the chat. Please try again.',
      chatWithUs: 'Chat with us',
      send: 'Send',
      welcomeTitle: 'Welcome to our chat',
      reconnecting: 'Reconnecting to chat...',
      reconnected: 'Successfully reconnected to chat.',
      reconnectionFailed: 'Failed to reconnect to chat session. Starting a new chat.',
      connectionLost: 'Connection lost. Attempting to reconnect...',
      reconnecting: 'Reconnecting to chat...',
      reconnected: 'Successfully reconnected to chat.',
      reconnectionFailed: 'Failed to reconnect to chat session. Please refresh the page to start a new chat.',
      team: 'Support Team',
      closeChat: 'Close Chat',
      endChat: 'End Chat',
      chatDeleted: 'This chat has been deleted.',
      chatDeletedDescription: 'This chat has been deleted. Please click the button below to start a new chat.',
      chatEnded: 'The chat session has ended.',
      chatEndedDescription: 'The chat session has ended. Please click the button below to start a new chat.',
      agentEndedChat: 'The agent has ended the chat.',
      agentEndedChatDescription: 'The agent has ended the chat. Please click the button below to start a new chat.',
    },
    de: {
      connecting: 'Verbindung zum Chat wird hergestellt...',
      teamOnline: 'Unser Team ist online und bereit, Ihnen zu helfen!',
      teamOffline: 'Unser Team ist derzeit offline. Hinterlassen Sie eine Nachricht und wir melden uns in Kürze bei Ihnen.',
      typeMessage: 'Nachricht eingeben...',
      yourEmail: 'Ihre E-Mail-Adresse',
      emailExplanation: 'Wir benötigen Ihre E-Mail-Adresse, um Sie zu kontaktieren, falls das Gespräch unterbrochen wird.',
      submitEmail: 'Absenden',
      emailRequired: 'E-Mail ist erforderlich',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      skipEmail: 'E-Mail-Eingabe überspringen',
      startNewChat: 'Neuen Chat starten',
      online: 'Online',
      offline: 'Offline',
      error: 'Fehler',
      connectionError: 'JustLive Chat: Verbindungsfehler. Bitte versuchen Sie es später erneut.',
      reconnectionError: 'JustLive Chat: Fehler bei der Wiederverbindung. Bitte aktualisieren Sie die Seite.',
      chatError: 'JustLive Chat: Im Chat ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      chatWithUs: 'Chatten Sie mit uns',
      send: 'Senden',
      welcomeTitle: 'Willkommen in unserem Chat',
      reconnecting: 'Verbindung zum Chat wird wiederhergestellt...',
      reconnected: 'Erfolgreich wieder mit dem Chat verbunden.',
      reconnectionFailed: 'Verbindung zum Chat konnte nicht wiederhergestellt werden. Ein neuer Chat wird gestartet.',
      connectionLost: 'Verbindung verloren. Es wird versucht, die Verbindung wiederherzustellen...',
      reconnecting: 'Verbindung zum Chat wird wiederhergestellt...',
      reconnected: 'Erfolgreich wieder mit dem Chat verbunden.',
      reconnectionFailed: 'Verbindung zum Chat konnte nicht wiederhergestellt werden. Bitte aktualisieren Sie die Seite, um einen neuen Chat zu starten.',
      team: 'Support Team',
      closeChat: 'Chat schließen',
      endChat: 'Chat beenden',
      chatDeleted: 'Dieser Chat wurde gelöscht.',
      chatDeletedDescription: 'Dieser Chat wurde gelöscht. Bitte klicken Sie auf den Button unten, um einen neuen Chat zu starten.',
      chatEnded: 'Der Chat wurde beendet.',
      chatEndedDescription: 'Der Chat wurde beendet. Bitte klicken Sie auf den Button unten, um einen neuen Chat zu starten.',
      agentEndedChat: 'Der Agent hat den Chat beendet.',
      agentEndedChatDescription: 'Der Agent hat den Chat beendet. Bitte klicken Sie auf den Button unten, um einen neuen Chat zu starten.',
    }
  };
  
  // Get the current language translations
  const t = isGerman ? translations.de : translations.en;

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

  // Initialize console based on initial debug mode
  toggleDebugMode(debugMode);
  
  // Expose global functions
  window.JustLiveChat = window.JustLiveChat || {};
  window.JustLiveChat.toggleDebug = toggleDebugMode;
  window.JustLiveChat.isDebugMode = () => debugMode;
  
  // Function to get available color presets
  window.JustLiveChat.getColorPresets = () => {
    return Object.keys(COLOR_PRESETS);
  };
  
  // Function to set color preset
  window.JustLiveChat.setColorPreset = (presetName) => {
    if (!COLOR_PRESETS[presetName]) {
      console.error(`JustLive Chat: Invalid color preset "${presetName}". Available presets: ${Object.keys(COLOR_PRESETS).join(', ')}`);
      return false;
    }
    
    window.JustLiveChat.setPrimaryColor(presetName);
    return true;
  };
  
  // Function to change language
  window.JustLiveChat.setLanguage = (language) => {
    if (language !== 'en' && language !== 'de') {
      console.error('JustLive Chat: Invalid language. Supported languages are "en" and "de".');
      return;
    }
    
    const newIsGerman = language === 'de';
    if (newIsGerman === isGerman) return; // No change needed
    
    // Update language
    isGerman = newIsGerman;
    const newT = isGerman ? translations.de : translations.en;
    
    // Update UI elements with new translations
    const welcomeMessage = document.querySelector('.justlive-chat-welcome-message');
    if (welcomeMessage) {
      welcomeMessage.textContent = newT.connecting;
    }
    
    const input = document.querySelector('.justlive-chat-input');
    if (input) {
      input.placeholder = newT.typeMessage;
    }
    
    const adminStatus = document.querySelector('.justlive-chat-admin-status');
    if (adminStatus) {
      const isOnline = adminStatus.classList.contains('online');
      adminStatus.querySelector('span:last-child').textContent = isOnline ? newT.online : newT.offline;
    }
    
    // Update welcome message if exists
    const welcomeEl = document.querySelector('.justlive-chat-welcome');
    if (welcomeEl && welcomeEl.querySelector('.justlive-chat-welcome-title')) {
      const isOnline = adminStatus && adminStatus.classList.contains('online');
      welcomeEl.querySelector('.justlive-chat-welcome-title').textContent = isOnline ? newT.teamOnline : newT.teamOffline;
      welcomeEl.querySelector('.justlive-chat-welcome-message').textContent = isOnline ? newT.teamOnline : newT.teamOffline;
    }
    
    console.log(`JustLive Chat: Language changed to ${language}`);
  };
  
  // Function to change primary color using presets
  window.JustLiveChat.setPrimaryColor = (presetName) => {
    // Validate preset name
    if (!COLOR_PRESETS[presetName]) {
      console.error(`JustLive Chat: Invalid color preset "${presetName}". Available presets: ${Object.keys(COLOR_PRESETS).join(', ')}`);
      return;
    }
    
    const preset = COLOR_PRESETS[presetName];
    const color = preset.primary;
    
    // Update button color
    const button = document.getElementById('justlive-chat-button');
    if (button) {
      button.style.backgroundColor = color;
    }
    
    // Update header color
    const header = document.querySelector('.justlive-chat-header');
    if (header) {
      header.style.backgroundColor = color;
    }
    
    // Update send button color
    const sendButton = document.querySelector('.justlive-chat-send');
    if (sendButton) {
      sendButton.style.backgroundColor = color;
    }
    
    // Update other buttons
    const restartButtons = document.querySelectorAll('.justlive-chat-restart');
    restartButtons.forEach(btn => {
      btn.style.backgroundColor = color;
    });
    
    const submitButtons = document.querySelectorAll('.justlive-chat-form-submit');
    submitButtons.forEach(btn => {
      btn.style.backgroundColor = color;
    });
    
    // Update start button
    const startButtons = document.querySelectorAll('.justlive-chat-start-button');
    startButtons.forEach(btn => {
      btn.style.backgroundColor = color;
    });
    
    // Update any other UI elements with primary color
    const chatElements = document.querySelectorAll('.justlive-chat-admin-status.online');
    chatElements.forEach(el => {
      el.style.color = color;
    });
    
    // Update pulse animation background color
    const style = document.createElement('style');
    style.textContent = `
      .justlive-chat-button.admin-online::before {
        background: ${preset.pulseBackground} !important;
      }
      
      .justlive-chat-send:hover,
      .justlive-chat-form-submit:hover,
      .justlive-chat-restart:hover,
      .justlive-chat-start-button:hover {
        background: ${preset.hoverBackground} !important;
      }
      
      .justlive-chat-message.visitor {
        background: ${color} !important;
        color: ${preset.textColor} !important;
      }
      
      .justlive-chat-input:focus,
      .justlive-chat-form-input:focus {
        border-color: ${color} !important;
        box-shadow: 0 0 0 3px ${preset.pulseBackground} !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log(`JustLive Chat: Color preset changed to ${presetName}`);
  };
  
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
      background: ${primaryColor};
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
      background: ${selectedPreset.pulseBackground};
      z-index: -1;
      animation: pulse 2s infinite;
    }
    
    /* Minimal preview of messages */
    .justlive-chat-mini-preview {
      position: absolute;
      bottom: 80px;
      right: 20px;
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 12px 16px;
      min-width: 160px;
      max-width: 250px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      line-height: 1.4;
      z-index: 999999;
      animation: fadeIn 0.3s ease-out;
      border: 1px solid ${primaryColor};
      display: none;
    }
    
    .justlive-chat-mini-preview.visible {
      display: block;
    }
    
    .justlive-chat-mini-preview-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;
      margin-bottom: 4px;
    }
    
    .justlive-chat-mini-preview-sender {
      font-weight: bold;
      font-size: 12px;
      color: ${primaryColor};
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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
    
    @keyframes pulse-notification {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      }
      
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
      }
      
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
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
      background: ${primaryColor};
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
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px ${selectedPreset.pulseBackground};
    }

    .justlive-chat-send {
      padding: 12px 18px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .justlive-chat-send:hover {
      background: ${selectedPreset.hoverBackground};
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
      color: #1f2937;
    }
    
    .justlive-chat-form-explanation {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 16px;
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
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px ${selectedPreset.pulseBackground};
    }
    
    .justlive-chat-form-error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
    }
    
    .justlive-chat-form-submit {
      width: 100%;
      padding: 12px;
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .justlive-chat-form-submit:hover {
      background: ${selectedPreset.hoverBackground};
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
      background: ${primaryColor};
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
      background: ${primaryColor};
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
      background: ${selectedPreset.hoverBackground};
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
      background: ${primaryColor};
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
      background: ${selectedPreset.hoverBackground};
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
      background: ${primaryColor};
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
      background: ${selectedPreset.hoverBackground};
      transform: translateY(-1px);
    }

    /* Burger menu and dropdown styles */
    .justlive-chat-menu-button {
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .justlive-chat-menu-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .justlive-chat-menu-icon {
      width: 18px;
      height: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .justlive-chat-menu-icon span {
      display: block;
      height: 2px;
      width: 100%;
      background-color: white;
      border-radius: 2px;
    }
    
    .justlive-chat-dropdown {
      position: absolute;
      top: 45px;
      right: 10px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 10;
      display: none;
    }
    
    .justlive-chat-dropdown.open {
      display: block;
      animation: fadeIn 0.2s ease-out;
    }
    
    .justlive-chat-dropdown-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      white-space: nowrap;
      color: #333;
      font-size: 14px;
    }
    
    .justlive-chat-dropdown-item:hover {
      background-color: #f5f5f5;
    }
    
    .justlive-chat-dropdown-item.danger {
      color: #e53e3e;
    }
    
    .justlive-chat-dropdown-item.danger:hover {
      background-color: #fff5f5;
    }
    
    .justlive-chat-dropdown-item.hidden {
      display: none;
    }
    
    .justlive-chat-close {
      display: none; /* Hide the original close button */
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
  const showError = (message, title = t.error) => {
    console.error(`JustLive Chat: ${message}`);
    
    // Create error display if it doesn't exist
    let errorDisplay = document.getElementById('justlive-chat-error');
    if (!errorDisplay) {
      errorDisplay = document.createElement('div');
      errorDisplay.id = 'justlive-chat-error';
      errorDisplay.style.position = 'fixed';
      errorDisplay.style.bottom = '20px';
      errorDisplay.style.right = '20px';
      errorDisplay.style.backgroundColor = '#fff';
      errorDisplay.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      errorDisplay.style.borderRadius = '8px';
      errorDisplay.style.padding = '15px';
      errorDisplay.style.zIndex = '10000';
      errorDisplay.style.maxWidth = '300px';
      errorDisplay.style.border = `1px solid ${primaryColor}`;
      
      errorDisplay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px; color: ${primaryColor};" id="justlive-chat-error-title"></div>
        <div id="justlive-chat-error-message"></div>
        <button style="background-color: ${primaryColor}; color: white; border: none; padding: 5px 10px; margin-top: 10px; border-radius: 4px; cursor: pointer;" onclick="this.parentNode.remove()">OK</button>
      `;
      
      document.body.appendChild(errorDisplay);
    }
    
    const errorTitle = document.getElementById('justlive-chat-error-title');
    const errorMessage = document.getElementById('justlive-chat-error-message');
    
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      const el = document.getElementById('justlive-chat-error');
      if (el) el.remove();
    }, 10000);
  };

  // Function to hide error message
  const hideError = () => {
    const errorDisplay = document.getElementById('justlive-chat-error');
    if (errorDisplay) {
      errorDisplay.remove();
    }
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

  // Erstelle das Mini-Preview-Element
  const miniPreview = document.createElement('div');
  miniPreview.className = 'justlive-chat-mini-preview';
  miniPreview.innerHTML = `
    <div class="justlive-chat-mini-preview-sender">${t.team}</div>
    <div class="justlive-chat-mini-preview-content"></div>
  `;
  
  // Funktion zum Anzeigen der Mini-Vorschau
  const showMiniPreview = (message) => {
    const contentEl = miniPreview.querySelector('.justlive-chat-mini-preview-content');
    contentEl.textContent = message;
    miniPreview.classList.add('visible');
  };

  const chatWindow = document.createElement('div');
  chatWindow.className = 'justlive-chat-window';
  chatWindow.innerHTML = `
    <div class="justlive-chat-header" style="background-color: ${primaryColor};">
      <h3 class="justlive-chat-title">
        ${t.chatWithUs}
        <div class="justlive-chat-admin-status offline">
          <span class="justlive-chat-admin-status-dot"></span>
          <span class="justlive-chat-admin-status-text">${t.offline}</span>
        </div>
      </h3>
      <div class="justlive-chat-close">✕</div>
      <div class="justlive-chat-menu-button">
        <div class="justlive-chat-menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="justlive-chat-dropdown">
        <div class="justlive-chat-dropdown-item" data-action="close">${t.closeChat || 'Chat schließen'}</div>
        <div class="justlive-chat-dropdown-item danger hidden" data-action="end">${t.endChat || 'Chat beenden'}</div>
      </div>
    </div>
    <div class="justlive-chat-messages"></div>
    <div class="justlive-chat-input-container">
      <input type="text" class="justlive-chat-input" placeholder="${t.typeMessage}">
      <button class="justlive-chat-send" style="background-color: ${primaryColor};">${t.send}</button>
    </div>
  `;

  container.appendChild(button);
  container.appendChild(chatWindow);
  container.appendChild(miniPreview);
  document.body.appendChild(container);

  // Mini-Vorschau bei Klick schließen und Chat öffnen
  miniPreview.addEventListener('click', () => {
    miniPreview.classList.remove('visible');
    if (!chatWindow.classList.contains('open')) {
      chatButton.click();
    }
  });

  // Socket.IO setup
  const script = document.createElement('script');
  script.src = 'https://cdn.socket.io/4.7.4/socket.io.min.js';
  script.onload = () => {
    console.log('Socket.IO script loaded');
    
    // Move variable declarations to the top before they're used
    // Variables for tracking state
    let currentRoomId = null;
    let isReconnecting = false;
    let wasReconnecting = false;
    let reconnected = false;
    let storedVisitorInfo = {};
    let chatWasActive = false;
    let storedSessionId = null;
    
    // Try to load stored visitor info
    try {
      const storedInfo = localStorage.getItem(`justlive-chat-visitor-${websiteId}`);
      if (storedInfo) {
        storedVisitorInfo = JSON.parse(storedInfo);
      }
    } catch (e) {
      console.error('Error parsing stored visitor info:', e);
    }
    
    // Get stored room ID from localStorage if available
    const storedRoomId = localStorage.getItem(`justlive-chat-room-${websiteId}`);
    if (storedRoomId) {
      console.log('Found stored room ID:', storedRoomId);
      currentRoomId = storedRoomId;
    }

    // Then retrieve stored values
    // Check if we have an active chat session
    const chatActive = localStorage.getItem(`justlive-chat-chat-active-${websiteId}`);
    if (chatActive === 'true') {
      chatWasActive = true;
    }
    
    // Get stored session ID if available
    storedSessionId = localStorage.getItem(`justlive-chat-session-${websiteId}`);

    // Initialize socket with reconnection options
    const socket = io(BACKEND_URL, {
      auth: {
        websiteId,
        reconnectAttempt: !!currentRoomId, // Flag to indicate this is a reconnection attempt
        sessionId: storedSessionId // Send stored session ID if available
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });
    
    // Initialize socket property to track if we've emitted a join event
    socket.hasEmittedJoin = false;

    let isConnected = false;
    let isChatEnded = false;
    let agentTyping = false;
    let isAdminOnline = false;
    let visitorInfo = {
      name: 'Visitor',
      email: '',
      url: window.location.href,
      pageTitle: document.title
    };
    let hasSubmittedInfo = false;

    // If we have stored visitor info, use it
    if (storedVisitorInfo && Object.keys(storedVisitorInfo).length > 0) {
      visitorInfo = storedVisitorInfo;
      // Set hasSubmittedInfo to true if we have stored visitor info
      hasSubmittedInfo = true;
    }

    // If we have an active chat session, set hasSubmittedInfo to true
    if (currentRoomId && chatWasActive) {
      hasSubmittedInfo = true;
    }

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
          adminStatus.innerHTML = `<span class="justlive-chat-admin-status-dot" style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; display: inline-block;"></span><span>${t.online}</span>`;
          adminStatus.style.color = '#10b981';
          
          // Add pulse effect to chat button
          chatButton.classList.add('admin-online');
        } else {
          adminStatus.classList.remove('online');
          adminStatus.classList.add('offline');
          adminStatus.innerHTML = `<span class="justlive-chat-admin-status-dot" style="width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; display: inline-block;"></span><span>${t.offline}</span>`;
          adminStatus.style.color = '#ef4444';
          
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

    const showChatEnded = (userInitiated = false) => {
      console.log('Showing chat ended message');
      
      // Set chat as ended
      isChatEnded = true;
      currentRoomId = null; // Reset room ID
      localStorage.removeItem(`justlive-chat-room-${websiteId}`);
      localStorage.removeItem(`justlive-chat-session-${websiteId}`);
      localStorage.removeItem(`justlive-chat-chat-active-${websiteId}`);
      localStorage.removeItem(`justlive-chat-visitor-${websiteId}`);
      
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
        <div class="justlive-chat-ended-title" style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">${userInitiated ? t.chatEnded : t.agentEndedChat}</div>
        <div class="justlive-chat-ended-message" style="font-size: 15px; margin-bottom: 20px; line-height: 1.4;">${userInitiated ? t.chatEndedDescription : t.agentEndedChatDescription}</div>
        <button class="justlive-chat-restart" style="background-color: ${primaryColor}; font-size: 16px; padding: 12px 24px; border-radius: 8px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">${t.startNewChat}</button>
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
            showError(t.connectionError, t.error);
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
      // Skip welcome message if we have an active chat session
      if (currentRoomId && !isChatEnded && chatWasActive) {
        console.log('Skipping welcome message due to active chat session');
        return skipWelcomeAndEmailOnReconnect();
      }
      
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
          <div class="justlive-chat-welcome-title" style="font-size: 22px; font-weight: 600; margin-bottom: 12px;">${t.welcomeTitle}</div>
          <div class="justlive-chat-welcome-message" style="font-size: 16px; margin-bottom: 20px; line-height: 1.4;">
            ${isAdminOnline ? t.teamOnline : t.teamOffline}
          </div>
          <button class="justlive-chat-start-button" style="background-color: ${primaryColor}; font-size: 16px; padding: 12px 24px; border-radius: 8px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">${t.startNewChat}</button>
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
      // Skip user info form if we have an active chat session
      if (currentRoomId && !isChatEnded && chatWasActive) {
        console.log('Skipping user info form due to active chat session');
        return skipWelcomeAndEmailOnReconnect();
      }
      
      console.log('Showing user info form');
      messagesContainer.innerHTML = '';
      
      // Make sure chat input remains disabled until user submits email
      input.disabled = true;
      sendButton.disabled = true;
      inputContainer.style.display = 'none';
      
      const formEl = document.createElement('div');
      formEl.className = 'justlive-chat-welcome'; // Verwende die gleiche Klasse wie die Willkommensnachricht
      formEl.innerHTML = `
        <div class="justlive-chat-welcome-title" style="font-size: 22px; font-weight: 600; margin-bottom: 12px;">${t.yourEmail}</div>
        <div class="justlive-chat-welcome-message" style="font-size: 14px; margin-bottom: 20px; line-height: 1.4;">
          ${t.emailExplanation}
        </div>
        <div style="margin-bottom: 20px;">
          <input type="email" id="visitor-email" class="justlive-chat-form-input" placeholder="${t.yourEmail}" 
            style="width: 100%; padding: 12px; font-size: 16px; border-radius: 8px; border: 1px solid #CBD5E0; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.05); background-color: white;">
          <div class="justlive-chat-form-error" id="email-error" 
            style="display: none; color: #E53E3E; margin-top: 6px; font-size: 14px;">${t.invalidEmail}</div>
        </div>
        <button class="justlive-chat-start-button" 
          style="background-color: ${primaryColor}; font-size: 16px; padding: 12px 24px; border-radius: 8px; 
          font-weight: 500; width: 100%; transition: all 0.2s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">${t.submitEmail}</button>
        <div class="justlive-chat-skip-email" style="text-align: center; margin-top: 12px;">
          <a href="#" style="color: ${primaryColor}; font-size: 14px; text-decoration: underline; cursor: pointer;">${t.skipEmail}</a>
        </div>
      `;
      messagesContainer.appendChild(formEl);
      
      // Add typing container at the end
      messagesContainer.appendChild(typingContainer);
      
      // Add event listener for form submission
      const submitButton = formEl.querySelector('.justlive-chat-start-button');
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
          
          // Wichtig: Direkt den Chat initialisieren, ohne wieder showWelcomeMessage aufzurufen
          // Entferne das Formular
          messagesContainer.innerHTML = '';
          
          // Aktiviere den Chat-Input
          input.disabled = false;
          sendButton.disabled = false;
          inputContainer.style.display = 'flex';
          
          // Zeige Lade-Indikator
          addSystemMessage(t.connecting);
          
          // Aktualisiere URL und Seitentitel
          visitorInfo.url = window.location.href;
          visitorInfo.pageTitle = document.title;
          
          // Versuche, dem Chat beizutreten
          socket.emit('chat:join', {
            websiteId,
            roomId: currentRoomId, // Verwende gespeicherte Room-ID, falls vorhanden
            visitorInfo
          });
          
          // Speichere Besucherinfo für Reconnection
          localStorage.setItem(`justlive-chat-visitor-${websiteId}`, JSON.stringify(visitorInfo));
          
          // Fokus auf Input setzen
          input.focus();
        }
      });
      
      // Add event listener for skip link
      const skipLink = formEl.querySelector('.justlive-chat-skip-email a');
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('User skipped email input');
        visitorInfo.name = "Visitor";
        visitorInfo.email = null;
        hasSubmittedInfo = true;
        
        // Wichtig: Direkt den Chat initialisieren, ohne wieder showWelcomeMessage aufzurufen
        // Entferne das Formular
        messagesContainer.innerHTML = '';
        
        // Aktiviere den Chat-Input
        input.disabled = false;
        sendButton.disabled = false;
        inputContainer.style.display = 'flex';
        
        // Zeige Lade-Indikator
        addSystemMessage(t.connecting);
        
        // Aktualisiere URL und Seitentitel
        visitorInfo.url = window.location.href;
        visitorInfo.pageTitle = document.title;
        
        // Versuche, dem Chat beizutreten
        socket.emit('chat:join', {
          websiteId,
          roomId: currentRoomId, // Verwende gespeicherte Room-ID, falls vorhanden
          visitorInfo
        });
        
        // Fokus auf Input setzen
        input.focus();
      });
      
      // Focus on email input
      emailInput.focus();
    };

    // Event handlers
    button.addEventListener('click', () => {
      // If disconnected, try to reconnect but still allow opening the chat window
      if (!isConnected) {
        console.log('Attempting to reconnect on chat button click');
        
        // Try to reconnect
        socket.connect();
        
        // Show error message but still open the chat window
        if (!isChatEnded) {
          showError(t.connectionError, t.error);
        }
      }
      
      // Verstecke die Mini-Vorschau
      miniPreview.classList.remove('visible');
      
      // Toggle chat window open/closed state regardless of connection state
      if (chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
      } else {
        chatWindow.classList.add('open');
        
        // Try to skip welcome and email if we have an active chat
        if (!skipWelcomeAndEmailOnReconnect()) {
          // If we couldn't skip (no active chat), show welcome message if needed
          if (!hasSubmittedInfo) {
            showWelcomeMessage();
          }
        }
        
        // Scroll to bottom when opening chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        // Always update URL and page title when sending a message
        visitorInfo.url = window.location.href;
        visitorInfo.pageTitle = document.title;
        
        socket.emit('chat:join', {
          websiteId,
          visitorInfo
        });
        
        // Mark that we've emitted a join event
        socket.hasEmittedJoin = true;
        
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
        showError(t.chatEnded, t.error);
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
      console.log('Connected to server');
      isConnected = true;
      isReconnecting = false;
      
      // If we were reconnecting, show a success message
      if (wasReconnecting) {
        wasReconnecting = false;
        addSystemMessage(t.reconnected);
      }
      
      // If we have a room ID stored, try to rejoin that room
      if (currentRoomId && !socket.hasEmittedJoin) {
        console.log('Attempting to rejoin room:', currentRoomId);
        
        // Update stored visitor info with current URL and page title
        if (storedVisitorInfo && Object.keys(storedVisitorInfo).length > 0) {
          storedVisitorInfo.url = window.location.href;
          storedVisitorInfo.pageTitle = document.title;
        }
        
        // Set hasSubmittedInfo to true to skip the email form on reconnect
        hasSubmittedInfo = true;
        
        // Emit join event with stored room ID
        socket.emit('chat:join', {
          websiteId,
          roomId: currentRoomId,
          visitorInfo: storedVisitorInfo,
          isReconnect: true
        });

        // Mark that we've emitted a join event
        socket.hasEmittedJoin = true;
        
        // Set chat as active
        localStorage.setItem(`justlive-chat-chat-active-${websiteId}`, 'true');
        
        // Show reconnecting message only if chat window is open
        if (chatWindow.classList.contains('open')) {
          addSystemMessage(t.reconnecting);
        }
      }
    });

    socket.on('chat:joined', (data) => {
      console.log('Joined chat room:', data.roomId);
      
      // Reset the join flag so we can join again if needed
      socket.hasEmittedJoin = false;
      
      // Store the room ID for reconnection
      currentRoomId = data.roomId;
      localStorage.setItem(`justlive-chat-room-${websiteId}`, currentRoomId);
      
      // Store visitor info for reconnection if available
      if (visitorInfo && Object.keys(visitorInfo).length > 0) {
        localStorage.setItem(`justlive-chat-visitor-${websiteId}`, JSON.stringify(visitorInfo));
      }
      
      // Stelle sicher, dass der Chat aktiv ist
      isChatEnded = false;
      input.disabled = false;
      sendButton.disabled = false;
      isConnected = true;
      
      // Set hasSubmittedInfo to true to skip the email form on reconnect
      hasSubmittedInfo = true;
      
      // Stelle sicher, dass der Chat-Container leer ist, wenn wir einen neuen Chat starten
      if (messagesContainer.children.length === 0) {
        addTimestamp();
      }
      
      // Enable input if it was disabled
      input.disabled = false;
      sendButton.disabled = false;
      inputContainer.style.display = 'flex';
      
      // Ersetze die "Verbindung wird hergestellt..." Nachricht mit dem aktuellen Admin-Status
      // Finde die letzte Systemnachricht, die "Verbindung zum Chat wird hergestellt..." enthält
      const systemMessages = messagesContainer.querySelectorAll('.justlive-chat-message.system');
      for (let i = systemMessages.length - 1; i >= 0; i--) {
        if (systemMessages[i].textContent === t.connecting) {
          // Entferne diese Nachricht
          systemMessages[i].parentElement.remove();
          break;
        }
      }
      
      // Frage den Admin-Status ab, um die richtige Nachricht anzuzeigen
      fetchAdminStatus();
      
      // Update end chat option visibility
      updateEndChatOptionVisibility();
    });

    socket.on('connect_error', (error) => {
      isConnected = false;
      console.error('JustLive Chat: Connection error:', error);
      
      // Update UI to show connection error
      updateConnectionStatus(false);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      isConnected = false;
      
      // Only show the reconnecting message if we were in an active chat
      if (currentRoomId) {
        isReconnecting = true;
        addSystemMessage(t.connectionLost);
      }
    });

    socket.on('reconnect', () => {
      console.log('Reconnected to server');
      isConnected = true;
      wasReconnecting = isReconnecting;
      isReconnecting = false;
      
      // Only attempt to rejoin if we were in an active chat
      if (currentRoomId) {
        // Attempt to rejoin the room
        socket.emit('chat:join', {
          websiteId,
          roomId: currentRoomId,
          visitorInfo: storedVisitorInfo,
          isReconnect: true
        });
        
        // Mark that we've emitted a join event
        socket.hasEmittedJoin = true;
      }
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
      if (currentRoomId && !isReconnecting) {
        isReconnecting = true;
        addSystemMessage(t.reconnecting);
      }
    });
    
    socket.on('reconnect_error', (error) => {
      console.error('JustLive Chat: Reconnection error:', error);
    });
    
    socket.on('reconnect_failed', () => {
      console.log('Failed to reconnect');
      isReconnecting = false;
      
      if (currentRoomId) {
        addSystemMessage(t.reconnectionFailed);
      }
    });

    // Funktion zum Hinzufügen einer Nachricht zum Chat
    const addMessage = (message) => {
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
      
      // Verwende das Datum aus der Nachricht, wenn vorhanden, sonst das aktuelle Datum
      const messageDate = message.createdAt ? new Date(message.createdAt) : new Date();
      timeElement.textContent = formatTime(messageDate);
      
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
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    socket.on('chat:message', (message) => {
      addMessage(message);
    });

    socket.on('chat:error', (error) => {
      if (error.message === 'Invalid room') {
        console.log('Invalid room, deleting room ID from localStorage');
        localStorage.removeItem(`justlive-chat-room-${websiteId}`);
        localStorage.removeItem(`justlive-chat-session-${websiteId}`);
        localStorage.removeItem(`justlive-chat-chat-active-${websiteId}`);
        localStorage.removeItem(`justlive-chat-visitor-${websiteId}`);
        restartChat();
        return;
      }
      console.error('JustLive Chat: Chat error:', error.message);
      showError(error.message, t.error);
    });

    socket.on('chat:session:end', () => {
      console.log('Chat session ended by agent');
      // Only show ended message if the chat hasn't already been marked as ended
      if (!isChatEnded) {
        showChatEnded();
        updateEndChatOptionVisibility();
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

        // Remove room ID from localStorage
        localStorage.removeItem(`justlive-chat-room-${websiteId}`);
        localStorage.removeItem(`justlive-chat-visitor-${websiteId}`);
        localStorage.removeItem(`justlive-chat-chat-active-${websiteId}`);
        localStorage.removeItem(`justlive-chat-session-${websiteId}`);
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
          <div class="justlive-chat-ended-title" style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">${t.chatDeleted}</div>
          <div class="justlive-chat-ended-message" style="font-size: 15px; margin-bottom: 20px; line-height: 1.4;">${t.chatDeletedDescription}</div>
          <button class="justlive-chat-restart" style="background-color: ${primaryColor}; font-size: 16px; padding: 12px 24px; border-radius: 8px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">${t.startNewChat}</button>
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
    
    // Track page visibility and unload
    window.addEventListener('beforeunload', () => {
      if (currentRoomId && !isChatEnded && !visitorLeftReported) {
        // Markieren, dass der Besucher als "verlassen" gemeldet wurde
        visitorLeftReported = true;
        
        // Nur sendBeacon verwenden, um doppelte Nachrichten zu vermeiden
        // Socket-Event entfernen, da es zu doppelten Nachrichten führt
        // socket.emit('chat:visitor:leave', { roomId: currentRoomId });
        
        // SendBeacon für zuverlässige Übertragung während des Entladens der Seite
        // if (navigator.sendBeacon) {
        //   const data = JSON.stringify({ roomId: currentRoomId });
        //   const blob = new Blob([data], { type: 'application/json' });
        //   navigator.sendBeacon(`${BACKEND_URL}/chat/visitor-left`, blob);
        // } else {
        //   // Fallback für Browser ohne sendBeacon-Unterstützung
        //   try {
        //     const xhr = new XMLHttpRequest();
        //     xhr.open('POST', `${BACKEND_URL}/chat/visitor-left`, false); // Synchroner Aufruf
        //     xhr.setRequestHeader('Content-Type', 'application/json');
        //     xhr.send(JSON.stringify({ roomId: currentRoomId }));
        //   } catch (e) {
        //     console.error('JustLive Chat: Failed to send visitor-left notification:', e);
        //   }
        // }
      }
    });

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
        if (messagesContainer.querySelector('.justlive-chat-user-form') || 
            (messagesContainer.querySelector('.justlive-chat-welcome') && messagesContainer.querySelector('#visitor-email'))) {
          console.log('User info form is showing, not updating welcome message');
          return;
        }
        
        const welcomeMessage = messagesContainer.querySelector('.justlive-chat-welcome-message');
        if (welcomeMessage) {
          console.log('Updating welcome message with admin status:', isAdminOnline);
          if (isAdminOnline) {
            welcomeMessage.textContent = t.teamOnline;
          } else {
            welcomeMessage.textContent = t.teamOffline;
          }
        } else {
          console.log('Welcome message element not found');
          
          // Create welcome message if it doesn't exist and user has submitted info
          if (hasSubmittedInfo && !messagesContainer.querySelector('.justlive-chat-user-info-form')) {
            console.log('Creating new welcome message');
            
            const newWelcomeMessage = document.createElement('div');
            newWelcomeMessage.className = 'justlive-chat-welcome-message';
            newWelcomeMessage.style.backgroundColor = '#E2E8F0';
            newWelcomeMessage.style.color = '#4A5568';
            newWelcomeMessage.style.border = '1px solid #CBD5E0';
            newWelcomeMessage.style.alignSelf = 'center';
            newWelcomeMessage.style.textAlign = 'center';
            newWelcomeMessage.style.maxWidth = '90%';
            newWelcomeMessage.style.borderRadius = '12px';
            newWelcomeMessage.style.marginBottom = '16px';
            newWelcomeMessage.style.marginTop = '8px';
            newWelcomeMessage.style.padding = '10px 15px';
            
            if (isAdminOnline) {
              newWelcomeMessage.textContent = t.teamOnline;
            } else {
              newWelcomeMessage.textContent = t.teamOffline;
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

    // Burger menu functionality
    const menuButton = chatWindow.querySelector('.justlive-chat-menu-button');
    const dropdown = chatWindow.querySelector('.justlive-chat-dropdown');
    
    // Toggle dropdown when clicking the menu button
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      updateEndChatOptionVisibility();
      dropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Handle dropdown item clicks
    dropdown.querySelectorAll('.justlive-chat-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        
        if (action === 'close') {
          // Just close the chat window (same as the original X button)
          chatWindow.classList.remove('open');
        } else if (action === 'end') {
          // End the chat session and report visitor left
          if (currentRoomId && !isChatEnded && !visitorLeftReported) {
            visitorLeftReported = true;
            
            // Send visitor left event
            if (socket.connected) {
              socket.emit('chat:visitor:leave', { roomId: currentRoomId });
            }
            
            // Clear local storage
            localStorage.removeItem(`justlive-chat-room-${websiteId}`);
            localStorage.removeItem(`justlive-chat-visitor-${websiteId}`);
            localStorage.removeItem(`justlive-chat-chat-active-${websiteId}`);
            localStorage.removeItem(`justlive-chat-session-${websiteId}`);
            
            // Show chat ended message
            showChatEnded(true);
            
            // Close the chat window
            chatWindow.classList.remove('open');
          }
        }
        
        // Close the dropdown
        dropdown.classList.remove('open');
      });
    });

    // Keep the original close button functionality for backward compatibility
    chatWindow.querySelector('.justlive-chat-close').addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('open');
    });

    // Function to update the end chat option visibility
    const updateEndChatOptionVisibility = () => {
      const endChatOption = dropdown.querySelector('[data-action="end"]');
      if (currentRoomId && !isChatEnded) {
        endChatOption.classList.remove('hidden');
      } else {
        endChatOption.classList.add('hidden');
      }
    };

    // Function to skip / remove welcome message and email input after page reload / reconnect
    // when there is a currentRoomId and !isChatEnded
    const skipWelcomeAndEmailOnReconnect = () => {
      // Check if we have an active chat session and it's not ended
      if (currentRoomId && !isChatEnded && chatWasActive) {
        console.log('Skipping welcome message and email input on reconnect');
        
        // Clear any welcome message or email form
        messagesContainer.innerHTML = '';
        
        // Enable chat input
        input.disabled = false;
        sendButton.disabled = false;
        inputContainer.style.display = 'flex';
        
        // Set hasSubmittedInfo to true to skip the email form
        hasSubmittedInfo = true;
        
        // Use stored visitor info if available
        if (storedVisitorInfo && Object.keys(storedVisitorInfo).length > 0) {
          visitorInfo = storedVisitorInfo;
        }
        
        // Emit join event with stored room ID
        socket.emit('chat:join', {
          websiteId,
          roomId: currentRoomId,
          visitorInfo: visitorInfo,
          isReconnect: true
        });
        
        // Mark that we've emitted a join event
        socket.hasEmittedJoin = true;
        
        // Set chat as active
        localStorage.setItem(`justlive-chat-chat-active-${websiteId}`, 'true');
        
        return true;
      }
      
      return false;
    };
  };

  document.head.appendChild(script);

  // Apply primary color preset after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Apply primary color preset
    window.JustLiveChat.setPrimaryColor(presetName);
  });

  // Add a variable to track unread messages
  let hasUnreadMessages = false;
})(); 