/**
 * Load HTML component into a target element
 * @param {string} path - Path to the component HTML file
 * @param {string} targetSelector - CSS selector for the target element
 * @returns {Promise<void>}
 */
export async function loadComponent(path, targetSelector) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${path}`);
    }
    const html = await response.text();
    const target = document.querySelector(targetSelector);
    if (!target) {
      throw new Error(`Target element not found: ${targetSelector}`);
    }
    target.innerHTML = html;
  } catch (error) {
    console.error('Error loading component:', error);
  }
}

/**
 * Load header and footer components
 * @returns {Promise<void>}
 */
export async function loadCommonComponents() {
  await Promise.all([
    loadComponent('./components/header.html', '#header-container'),
    loadComponent('./components/footer.html', '#footer-container')
  ]);
}
