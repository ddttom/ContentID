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

    // Handle header specific logic after loading
    if (path.includes('header.html')) {
      setupHeader();
    }
  } catch (error) {
    console.error('Error loading component:', error);
  }
}

/**
 * Setup header based on current page
 */
function setupHeader() {
  const marketingNav = document.querySelector('[data-marketing-nav]');
  if (!marketingNav) return;

  // Only show marketing nav on index page
  const isIndexPage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/');
  marketingNav.style.display = isIndexPage ? 'flex' : 'none';

  // Setup toolbar content based on current page
  setupToolbar();
}

/**
 * Setup toolbar content based on current page
 */
function setupToolbar() {
  const toolbar = document.querySelector('.toolbar');
  const pageTitle = toolbar?.querySelector('.page-title');
  const pageActions = toolbar?.querySelector('.page-actions');
  if (!toolbar || !pageTitle || !pageActions) return;

  const pathname = window.location.pathname;
  
  // Set page specific content
  if (pathname.includes('entry.html')) {
    pageTitle.textContent = 'Content Entry';
    pageActions.innerHTML = '<button class="action-btn" id="save-entry">Save Entry</button>';
  } else if (pathname.includes('list.html')) {
    pageTitle.textContent = 'Content List';
    pageActions.innerHTML = '<button class="action-btn" id="add-entry">Add Entry</button>';
  } else {
    // Hide toolbar on pages without actions
    toolbar.style.display = 'none';
  }

  // Setup toolbar action handlers
  const addEntryBtn = pageActions.querySelector('#add-entry');
  if (addEntryBtn) {
    addEntryBtn.addEventListener('click', () => {
      window.location.href = 'entry.html';
    });
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
