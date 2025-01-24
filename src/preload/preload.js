// Preload script - CommonJS
const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel, data) => {
    // Whitelist channels
    const validChannels = ['message'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  onMessage: (channel, func) => {
    const validChannels = ['message'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
