const electron = require('electron');
const { startWebServer } = require('../src/main/web-server');
const request = require('supertest');

// Mock Electron APIs
jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    quit: jest.fn()
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    webContents: {
      openDevTools: jest.fn()
    },
    on: jest.fn()
  }))
}));

describe('Main Process', () => {
  test('should create BrowserWindow instance', () => {
    require('../src/main/index.js');
    expect(electron.BrowserWindow).toHaveBeenCalled();
  });

  test('should start web server', async () => {
    const server = await startWebServer(3000);
    expect(server).toBeDefined();
    
    // Test web server response
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    
    // Cleanup
    server.close();
  });
});
