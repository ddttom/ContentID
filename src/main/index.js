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
import('./web-server.js').then(module => {
  startWebServer = module.startWebServer;
});

// Configuration constants
const isDevelopment = process.env.NODE_ENV === 'development';
const WEB_SERVER_PORT = 3000;

// Keep a global reference of the window object
let mainWindow;

async function createWindow() {
  // Wait for web server to be imported
  while (!startWebServer) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Start the web server
  startWebServer(WEB_SERVER_PORT);

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the web interface
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${WEB_SERVER_PORT}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
