import { loadBlock } from './lib.js';

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
  // Load critical content
  await loadHeader();
  document.body.classList.add('appear');
  
  // Load non-critical content
  requestIdleCallback(async () => {
    await loadFooter();
    initializeBlocks();
  });
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
