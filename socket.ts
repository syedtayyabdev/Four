
type Callback = (data: any) => void;

class SocketMock {
  private listeners: { [event: string]: Callback[] } = {};

  constructor() {
    // Listen for cross-tab or internal custom events to simulate server push
    window.addEventListener('socket-message', (event: any) => {
      const { type, data } = event.detail;
      if (this.listeners[type]) {
        this.listeners[type].forEach(cb => cb(data));
      }
    });
  }

  on(event: string, callback: Callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    // In a real app, this would be: this.socket.emit(event, data)
    // Here we simulate the server broadcasting it back to all "clients"
    const socketEvent = new CustomEvent('socket-message', {
      detail: { type: event, data }
    });
    
    // Simulate network latency
    setTimeout(() => {
      window.dispatchEvent(socketEvent);
    }, 100);
  }
}

export const socket = new SocketMock();
