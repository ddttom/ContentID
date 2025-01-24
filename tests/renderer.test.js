import { App } from '../src/renderer/index.js';

describe('Renderer Process', () => {
  beforeEach(() => {
    // Set up a basic DOM structure
    document.body.innerHTML = `
      <div id="app">
        <h1>Hello World</h1>
      </div>
    `;
  });

  test('should initialize App class', () => {
    const app = new App();
    expect(app).toBeInstanceOf(App);
  });

  test('should add loaded class to app element', () => {
    const app = new App();
    const appElement = document.getElementById('app');
    expect(appElement.classList.contains('loaded')).toBe(true);
  });

  test('should log initialization message', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    new App();
    expect(consoleSpy).toHaveBeenCalledWith('Renderer process initialized');
  });
});
