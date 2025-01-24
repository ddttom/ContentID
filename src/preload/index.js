// Create a require function for CommonJS modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import Electron using CommonJS
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    // Whitelist channels
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// Prevent renderer process from using Node.js APIs directly
contextBridge.exposeInMainWorld('nodeProcess', {
  env: {
    NODE_ENV: process.env.NODE_ENV
  }
});
