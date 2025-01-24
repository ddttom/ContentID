const mockApp = {
  whenReady: jest.fn(() => Promise.resolve()),
  isRunning: jest.fn(() => true),
  quit: jest.fn(() => Promise.resolve())
};

// Create a mock BrowserWindow class
class MockBrowserWindow {
  constructor() {
    this.loadURL = jest.fn();
    this.loadFile = jest.fn();
    this.webContents = {
      openDevTools: jest.fn(),
      on: jest.fn()
    };
    this.on = jest.fn();
    this.destroy = jest.fn();
  }
}

// Static method for getAllWindows
MockBrowserWindow.getAllWindows = jest.fn(() => [new MockBrowserWindow()]);

module.exports = {
  app: mockApp,
  BrowserWindow: MockBrowserWindow
};
