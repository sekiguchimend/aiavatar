/**
 * Avatar Widget - Script Tag Integration
 * 
 * Usage:
 * <script src="https://your-domain.com/avatar-widget.js"></script>
 * <avatar-widget 
 *   api-key="your-api-key"
 *   api-url="https://your-api-url.com"
 *   model-type="vrm"
 *   character-name="Character"
 * ></avatar-widget>
 */

(function() {
  'use strict';

  class AvatarWidget extends HTMLElement {
    constructor() {
      super();
      this.iframe = null;
      this.config = {};
    }

    static get observedAttributes() {
      return [
        'api-key',
        'google-key',
        'ai-service',
        'ai-model',
        'api-url',
        'model-type',
        'character-name',
        'width',
        'height',
        'position'
      ];
    }

    connectedCallback() {
      this.loadConfig();
      this.createWidget();
    }

    disconnectedCallback() {
      // Remove message listener
      if (this._messageHandler) {
        window.removeEventListener('message', this._messageHandler);
        this._messageHandler = null;
      }
      
      if (this.iframe) {
        this.iframe.remove();
        this.iframe = null;
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.loadConfig();
        if (this.iframe) {
          this.updateIframe();
        }
      }
    }

    loadConfig() {
      this.config = {
        apiKey: this.getAttribute('api-key') || '',
        googleKey: this.getAttribute('google-key') || '',
        aiService: this.getAttribute('ai-service') || '',
        aiModel: this.getAttribute('ai-model') || '',
        apiUrl: this.getAttribute('api-url') || window.location.origin,
        modelType: this.getAttribute('model-type') || 'live2d',
        characterName: this.getAttribute('character-name') || 'Character',
        width: this.getAttribute('width') || '100%',
        height: this.getAttribute('height') || '100vh',
        position: this.getAttribute('position') || 'fixed'
      };
    }

    createWidget() {
      // Create shadow DOM for isolation (only if not already created)
      let shadowRoot = this.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = this.attachShadow({ mode: 'open' });
      } else {
        // Clear existing content if re-creating
        shadowRoot.innerHTML = '';
      }

      // Create container
      const container = document.createElement('div');
      container.style.cssText = `
        position: ${this.config.position};
        top: 0;
        left: 0;
        width: ${this.config.width};
        height: ${this.config.height};
        z-index: 9999;
        border: none;
        margin: 0;
        padding: 0;
      `;

      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
      `;
      
      // Build widget URL with config
      const widgetUrl = this.buildWidgetUrl();
      this.iframe.src = widgetUrl;
      this.iframe.setAttribute('allowfullscreen', 'true');
      this.iframe.allow = 'camera; microphone; autoplay; fullscreen';
      
      container.appendChild(this.iframe);
      
      // Append to shadow root
      if (shadowRoot) {
        shadowRoot.appendChild(container);
      } else {
        // Fallback if shadow DOM is not supported
        this.appendChild(container);
      }

      // Remove existing message listener if any
      if (this._messageHandler) {
        window.removeEventListener('message', this._messageHandler);
      }
      
      // Listen for messages from iframe
      this._messageHandler = this.handleMessage.bind(this);
      window.addEventListener('message', this._messageHandler);
    }

    buildWidgetUrl() {
      const baseUrl = this.config.apiUrl;
      const params = new URLSearchParams({
        widget: 'true',
        'model-type': this.config.modelType,
        'character-name': this.config.characterName,
      });
      
      // API Key設定（google-key優先）
      if (this.config.googleKey) {
        params.set('google-key', this.config.googleKey);
        if (this.config.aiService) {
          params.set('ai-service', this.config.aiService);
        } else {
          params.set('ai-service', 'google');
        }
        if (this.config.aiModel) {
          params.set('ai-model', this.config.aiModel);
        } else {
          params.set('ai-model', 'gemini-2.5-flash');
        }
      } else if (this.config.apiKey) {
        params.set('api-key', this.config.apiKey);
        if (this.config.aiService) {
          params.set('ai-service', this.config.aiService);
        }
        if (this.config.aiModel) {
          params.set('ai-model', this.config.aiModel);
        }
      }
      
      return `${baseUrl}/?${params.toString()}`;
    }

    updateIframe() {
      if (this.iframe) {
        this.iframe.src = this.buildWidgetUrl();
      }
    }

    handleMessage(event) {
      // Security: Only accept messages from same origin or localhost (for development)
      const allowedOrigins = [
        this.config.apiUrl,
        window.location.origin,
        'http://localhost:3000',
        'https://localhost:3000'
      ];
      
      if (!allowedOrigins.some(origin => event.origin.startsWith(origin.replace(/\/$/, '')))) {
        console.warn('Rejected message from origin:', event.origin);
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'widget-ready':
          this.dispatchEvent(new CustomEvent('ready', { detail: data }));
          break;
        case 'message-sent':
          this.dispatchEvent(new CustomEvent('message-sent', { detail: data }));
          break;
        case 'message-received':
          this.dispatchEvent(new CustomEvent('message-received', { detail: data }));
          break;
        case 'error':
          this.dispatchEvent(new CustomEvent('error', { detail: data }));
          break;
      }
    }

    // Public API methods
    sendMessage(message) {
      if (!message || typeof message !== 'string') {
        console.warn('sendMessage: message must be a non-empty string');
        return;
      }
      
      if (!this.iframe) {
        console.warn('sendMessage: iframe not initialized yet');
        return;
      }
      
      if (!this.iframe.contentWindow) {
        console.warn('sendMessage: iframe contentWindow not available');
        return;
      }
      
      try {
        this.iframe.contentWindow.postMessage({
          type: 'send-message',
          data: { message }
        }, this.config.apiUrl);
      } catch (error) {
        console.error('sendMessage error:', error);
      }
    }

    setConfig(config) {
      Object.keys(config).forEach(key => {
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.setAttribute(attrName, config[key]);
      });
    }
  }

  // Register custom element
  if (!customElements.get('avatar-widget')) {
    customElements.define('avatar-widget', AvatarWidget);
  }

  // Export for programmatic use
  window.AvatarWidget = AvatarWidget;
})();

