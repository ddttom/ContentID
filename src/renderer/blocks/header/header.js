import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load header CSS
  await loadCSS('blocks/header/header.css');
  
  // Create header structure
  const header = document.createElement('header');
  header.classList.add('header');
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('header-wrapper');
  
  // Logo
  const logo = document.createElement('div');
  logo.classList.add('logo');
  logo.textContent = 'ContentID';
  
  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('nav');
  
  const navItems = [
    { text: 'Home', href: '#' },
    { text: 'Features', href: '#' },
    { text: 'Pricing', href: '#' },
    { text: 'About', href: '#' }
  ];
  
  navItems.forEach(item => {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    nav.appendChild(link);
  });
  
  // Actions
  const actions = document.createElement('div');
  actions.classList.add('actions');
  
  const loginBtn = document.createElement('a');
  loginBtn.classList.add('login-btn');
  loginBtn.href = '#';
  loginBtn.textContent = 'Login';
  
  actions.appendChild(loginBtn);
  
  // Assemble header
  wrapper.appendChild(logo);
  wrapper.appendChild(nav);
  wrapper.appendChild(actions);
  header.appendChild(wrapper);
  
  // Replace block with new header
  block.replaceWith(header);
}
