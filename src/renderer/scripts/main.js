import { loadBlock, loadCSS } from './lib.js';

async function loadHeader() {
  const header = document.querySelector('header');
  if (header) {
    await loadBlock(header);
  }
}

async function loadFooter() {
  const footer = document.querySelector('footer');
  if (footer) {
    await loadBlock(footer);
  }
}

async function loadPage() {
  // Make sure base styles are loaded
  await loadCSS('styles/styles.css');
  
  // Load blocks
  await Promise.all([
    loadHeader(),
    loadFooter(),
    initializeBlocks()
  ]);
  
  // Show content after everything is loaded
  document.body.classList.add('appear');
}

function initializeBlocks() {
  const blocks = document.querySelectorAll('.block');
  blocks.forEach(block => {
    loadBlock(block);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadPage();
});
