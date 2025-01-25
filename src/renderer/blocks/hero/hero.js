import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load hero CSS
  await loadCSS('/blocks/hero/hero.css');
  
  // Create hero structure
  const hero = document.createElement('div');
  hero.classList.add('hero');
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-wrapper');
  
  const title = document.createElement('h1');
  title.textContent = block.querySelector('h1')?.textContent || 'Trusted Content Verification';
  
  const content = document.createElement('div');
  content.classList.add('content');
  
  const description = document.createElement('p');
  description.textContent = block.querySelector('p')?.textContent || 'ContentID provides cryptographically signed digital passports for content, establishing a chain of trust and authenticity verification for AI systems.';
  
  const cta = document.createElement('a');
  cta.classList.add('cta-btn');
  cta.href = '#';
  cta.textContent = 'Get Started';
  
  content.appendChild(description);
  content.appendChild(cta);
  
  wrapper.appendChild(title);
  wrapper.appendChild(content);
  hero.appendChild(wrapper);
  
  // Replace block with new hero
  block.replaceWith(hero);
}
