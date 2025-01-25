import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load content CSS
  await loadCSS('/blocks/content/content.css');
  
  // Create content structure
  const content = document.createElement('div');
  content.classList.add('content');
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('content-wrapper');
  
  const title = document.createElement('h2');
  title.textContent = block.querySelector('h2')?.textContent || 'Why ContentID Matters';
  
  const grid = document.createElement('div');
  grid.classList.add('grid');
  
  // Create grid items
  const items = [
    {
      title: 'Verified Content',
      description: 'Ensure the authenticity of your digital content with cryptographic signatures that create a verifiable chain of trust.'
    },
    {
      title: 'AI Integration',
      description: 'Enable AI systems to distinguish between verified and unverified information with our digital passport system.'
    },
    {
      title: 'Enterprise Ready',
      description: 'Designed for enterprise content managers, legal teams, and technical documentation specialists.'
    }
  ];
  
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    
    const itemTitle = document.createElement('h3');
    itemTitle.textContent = item.title;
    
    const itemDesc = document.createElement('p');
    itemDesc.textContent = item.description;
    
    itemDiv.appendChild(itemTitle);
    itemDiv.appendChild(itemDesc);
    grid.appendChild(itemDiv);
  });
  
  wrapper.appendChild(title);
  wrapper.appendChild(grid);
  content.appendChild(wrapper);
  
  // Replace block with new content
  block.replaceWith(content);
}
