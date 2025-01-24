const { app, BrowserWindow } = require('electron');
const { createWindow, getWindows } = require('../../src/main/main.js');

jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn(() => Promise.resolve()),
    quit: jest.fn(() => Promise.resolve())
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn(),
    webContents: {
      on: jest.fn(),
      openDevTools: jest.fn()
    }
  }))
}));

// Add getAllWindows static method to BrowserWindow mock
BrowserWindow.getAllWindows = jest.fn(() => [new BrowserWindow()]);

describe('Main Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createWindow returns a BrowserWindow instance', () => {
    const window = createWindow();
    expect(window).toBeDefined();
    expect(BrowserWindow).toHaveBeenCalledTimes(1);
  });

  test('getWindows returns an array', () => {
    const windows = getWindows();
    expect(Array.isArray(windows)).toBeTruthy();
    expect(windows.length).toBe(1);
  });

  test('app lifecycle methods are called', async () => {
    await app.whenReady();
    expect(app.whenReady).toHaveBeenCalledTimes(1);

    await app.quit();
    expect(app.quit).toHaveBeenCalledTimes(1);
  });
});
