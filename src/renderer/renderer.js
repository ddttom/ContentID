// Renderer process - ES Module
const messageElement = document.getElementById('message');

// Display hello world message
messageElement.textContent = 'Hello World!';

// Example of using the exposed electron API with proper checks
if (window.electronAPI) {
  try {
    window.electronAPI.onMessage('message', (data) => {
      console.log('Received message:', data);
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
} else {
  console.warn('electronAPI not available');
}
