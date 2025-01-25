import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load steps CSS
  await loadCSS('/blocks/steps/steps.css');
  
  // Create steps structure
  const steps = document.createElement('div');
  steps.classList.add('steps');
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('steps-wrapper');
  
  const title = document.createElement('h2');
  title.textContent = block.querySelector('h2')?.textContent || 'How It Works';
  
  const stepItems = document.createElement('div');
  stepItems.classList.add('step-items');
  
  // Create step items
  const stepsData = [
    {
      number: '1',
      title: 'Content Creation',
      description: 'Create content using your existing tools and workflows.'
    },
    {
      number: '2',
      title: 'Digital Passport',
      description: 'Generate a cryptographic signature that creates a unique digital passport for your content.'
    },
    {
      number: '3',
      title: 'Verification',
      description: 'AI systems and users can verify content authenticity through our verification system.'
    }
  ];
  
  stepsData.forEach(step => {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');
    
    const number = document.createElement('div');
    number.classList.add('number');
    number.textContent = step.number;
    
    const text = document.createElement('div');
    text.classList.add('text');
    
    const stepTitle = document.createElement('h3');
    stepTitle.textContent = step.title;
    
    const stepDesc = document.createElement('p');
    stepDesc.textContent = step.description;
    
    text.appendChild(stepTitle);
    text.appendChild(stepDesc);
    
    stepDiv.appendChild(number);
    stepDiv.appendChild(text);
    stepItems.appendChild(stepDiv);
  });
  
  wrapper.appendChild(title);
  wrapper.appendChild(stepItems);
  steps.appendChild(wrapper);
  
  // Replace block with new steps
  block.replaceWith(steps);
}
