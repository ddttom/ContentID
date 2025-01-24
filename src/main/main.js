// Main process - CommonJS
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the renderer
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Open dev tools only on explicit request
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.code === 'KeyI' && input.control && input.shift) {
      mainWindow.webContents.openDevTools();
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (on all platforms)
app.on('window-all-closed', () => {
  app.quit();
});
