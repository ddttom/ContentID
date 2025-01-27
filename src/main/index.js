// Create a require function for CommonJS modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import path from 'path';

// Import Electron using CommonJS
const { app, BrowserWindow } = require('electron');

// Get directory name equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import web server using ES modules
let startWebServer;
let stopWebServer;
import('./web-server.js').then(module => {
  startWebServer = module.startWebServer;
  stopWebServer = module.stopWebServer;
});

// Configuration constants
const isDevelopment = process.env.NODE_ENV === 'development';
const WEB_SERVER_PORT = 3000;

// Default window dimensions increased by 50%
const DEFAULT_WIDTH = 1800;  // increased from 1200
const DEFAULT_HEIGHT = 1200; // increased from 800

// Keep a global reference of the window object
let mainWindow;

async function createWindow() {
  // Wait for web server to be imported
  while (!startWebServer) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Start the web server
  await startWebServer(WEB_SERVER_PORT);

  // Create the browser window with 50% larger dimensions
  mainWindow = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  });

  // Handle navigation events
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow navigation to local URLs
    if (url.startsWith(`http://localhost:${WEB_SERVER_PORT}`)) {
      return;
    }
    // Prevent navigation to external URLs
    event.preventDefault();
  });

  // Load the web interface
  if (isDevelopment) {
    await mainWindow.loadURL(`http://localhost:${WEB_SERVER_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, we'll use the same web server to serve the app
    await mainWindow.loadURL(`http://localhost:${WEB_SERVER_PORT}`);
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron app lifecycle
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // Stop the web server before quitting
  if (stopWebServer) {
    stopWebServer();
  }
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle cleanup on quit
app.on('will-quit', () => {
  // Perform any necessary cleanup here
});
