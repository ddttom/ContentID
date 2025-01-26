import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  // Load footer CSS
  await loadCSS('blocks/footer/footer.css');
  
  // Create footer structure
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  
  const wrapper = document.createElement('div');
  wrapper.classList.add('footer-wrapper');
  
  // Logo section
  const logoSection = document.createElement('div');
  logoSection.classList.add('section');
  
  const logo = document.createElement('div');
  logo.classList.add('logo');
  logo.textContent = 'ContentID';
  
  const tagline = document.createElement('p');
  tagline.textContent = 'Trusted Content Verification System';
  
  logoSection.appendChild(logo);
  logoSection.appendChild(tagline);
  
  // Quick Links section
  const quickLinks = document.createElement('div');
  quickLinks.classList.add('section');
  
  const quickLinksHeader = document.createElement('h4');
  quickLinksHeader.textContent = 'Quick Links';
  
  const quickLinksList = document.createElement('ul');
  const quickLinksItems = [
    { text: 'Features', href: '#' },
    { text: 'Pricing', href: '#' },
    { text: 'Documentation', href: '#' }
  ];
  
  quickLinksItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    li.appendChild(a);
    quickLinksList.appendChild(li);
  });
  
  quickLinks.appendChild(quickLinksHeader);
  quickLinks.appendChild(quickLinksList);
  
  // Legal section
  const legal = document.createElement('div');
  legal.classList.add('section');
  
  const legalHeader = document.createElement('h4');
  legalHeader.textContent = 'Legal';
  
  const legalList = document.createElement('ul');
  const legalItems = [
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Service', href: '#' }
  ];
  
  legalItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    li.appendChild(a);
    legalList.appendChild(li);
  });
  
  legal.appendChild(legalHeader);
  legal.appendChild(legalList);
  
  // Footer bottom
  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-bottom');
  footerBottom.textContent = '© 2025 ContentID. All rights reserved.';
  
  // Assemble footer
  wrapper.appendChild(logoSection);
  wrapper.appendChild(quickLinks);
  wrapper.appendChild(legal);
  footer.appendChild(wrapper);
  footer.appendChild(footerBottom);
  
  // Replace block with new footer
  block.replaceWith(footer);
}
