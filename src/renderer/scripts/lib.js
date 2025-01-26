// Block registry
const blocks = {};

export function registerBlock(name, mod) {
  blocks[name] = mod;
}

// Block loading
export async function loadBlock(block) {
  const name = block.dataset.blockName || block.classList[0];
  if (!blocks[name]) {
    try {
      const mod = await import(`../blocks/${name}/${name}.js`);
      registerBlock(name, mod);
    } catch (error) {
      console.error(`Failed to load block ${name}:`, error);
      return;
    }
  }
  await blocks[name].default(block);
}

// CSS loading
export async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    // Remove leading slash to make path relative
    const path = href.startsWith('/') ? href.substring(1) : href;
    
    if (!document.querySelector(`link[href="${path}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
}

// Utility functions
export function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
