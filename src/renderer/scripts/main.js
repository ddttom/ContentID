import { processContent } from '../utils/content-processor.js';
import { loadBlock } from '../scripts/lib.js';

async function loadPage() {
  // Load header and footer
  const header = await fetch('/static/header.html').then(res => res.text());
  const footer = await fetch('/static/footer.html').then(res => res.text());
  
  // Process main content
  const content = await processContent('/index.md');
  
  // Apply template
  document.body.innerHTML = content
    .replace('{{ HEADER }}', header)
    .replace('{{ FOOTER }}', footer);
  
  // Initialize blocks
  document.querySelectorAll('.block').forEach(block => {
    loadBlock(block);
  });
}

document.addEventListener('DOMContentLoaded', loadPage);
