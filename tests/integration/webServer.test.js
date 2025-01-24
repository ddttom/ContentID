const request = require('supertest');
const { createWebServer, stopWebServer } = require('../../src/main/main.js');

describe('Web Server', () => {
  let server;

  beforeAll(async () => {
    // Start the web server on a different port for tests
    process.env.WEB_PORT = '3001';
    server = await createWebServer();
  });

  afterAll(async () => {
    await stopWebServer();
  });

  test('responds to GET /', async () => {
    const response = await request(server)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
    
    expect(response.text).toContain('Hello World');
  });

  test('serves static files', async () => {
    const response = await request(server)
      .get('/favicon.ico')
      .expect('Content-Type', /image\/x-icon/)
      .expect(200);
    
    // Verify the response has content
    expect(response.headers['content-length']).toBeDefined();
    expect(Number(response.headers['content-length'])).toBeGreaterThan(0);
  });
});
