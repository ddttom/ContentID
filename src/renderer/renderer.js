// Renderer process - ES Module
const messageElement = document.getElementById('message');

// Display hello world message
messageElement.textContent = 'Hello World!';

// Example of using the exposed electron API
window.electronAPI.onMessage('message', (data) => {
  console.log('Received message:', data);
});
