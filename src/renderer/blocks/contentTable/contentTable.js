import { loadCSS } from '../../scripts/lib.js';

const ITEMS_PER_PAGE = 10;

export default async function decorate(block) {
  await loadCSS('/blocks/contentTable/contentTable.css');
  block.dataset.blockStatus = 'loading';

  let currentPage = 1;
  let sortColumn = 'createdDate';
  let sortDirection = 'desc';
  let filterType = '';
  let filterStatus = '';
  let searchQuery = '';

  // Cache DOM elements
  const table = block.querySelector('.content-table');
  const tbody = table.querySelector('tbody');
  const searchInput = block.querySelector('.search-input');
  const typeFilter = block.querySelector('.filter-type');
  const statusFilter = block.querySelector('.filter-status');
  const prevButton = block.querySelector('.prev-page');
  const nextButton = block.querySelector('.next-page');
  const currentPageSpan = block.querySelector('.current-page');

  // Load content data
  async function loadContent() {
    try {
      table.dataset.loading = 'true';
      const content = await window.contentAPI.loadContent();
      return content;
    } catch (error) {
      console.error('Failed to load content:', error);
      tbody.innerHTML = '<tr><td colspan="7">Error loading content</td></tr>';
      return [];
    } finally {
      table.dataset.loading = 'false';
    }
  }

  // Filter and sort content
  function processContent(content) {
    let filtered = content;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(item => item.type === filterType);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(item => item.approvalStatus === filterStatus);
    }

    // Sort content
    filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    return filtered;
  }

  // Render table page
  function renderPage(content) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = content.slice(start, end);

    tbody.innerHTML = pageItems.map(item => `
      <tr>
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>${item.type}</td>
        <td>${item.approvalStatus}</td>
        <td>${new Date(item.createdDate).toLocaleDateString()}</td>
        <td>${new Date(item.validUntil).toLocaleDateString()}</td>
        <td>
          <button class="action-button edit-button" data-id="${item.id}">Edit</button>
          <button class="action-button view-button" data-id="${item.id}">View</button>
        </td>
      </tr>
    `).join('');

    // Update pagination
    const totalPages = Math.ceil(content.length / ITEMS_PER_PAGE);
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    currentPageSpan.textContent = currentPage;
  }

  // Initialize type filter options
  function initializeFilters(content) {
    const types = [...new Set(content.map(item => item.type))];
    typeFilter.innerHTML = `
      <option value="">All Types</option>
      ${types.map(type => `<option value="${type}">${type}</option>`).join('')}
    `;

    const statuses = [...new Set(content.map(item => item.approvalStatus))];
    statusFilter.innerHTML = `
      <option value="">All Statuses</option>
      ${statuses.map(status => `<option value="${status}">${status}</option>`).join('')}
    `;
  }

  // Event handlers
  function setupEventListeners(content) {
    // Search input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderPage(processContent(content));
    });

    // Filters
    typeFilter.addEventListener('change', (e) => {
      filterType = e.target.value;
      currentPage = 1;
      renderPage(processContent(content));
    });

    statusFilter.addEventListener('change', (e) => {
      filterStatus = e.target.value;
      currentPage = 1;
      renderPage(processContent(content));
    });

    // Pagination
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(processContent(content));
      }
    });

    nextButton.addEventListener('click', () => {
      const totalPages = Math.ceil(processContent(content).length / ITEMS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(processContent(content));
      }
    });

    // Column sorting
    table.querySelectorAll('th').forEach(th => {
      const column = th.textContent.toLowerCase().replace(/\s+/g, '');
      th.addEventListener('click', () => {
        if (sortColumn === column) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortColumn = column;
          sortDirection = 'asc';
        }
        renderPage(processContent(content));
      });
    });

    // Action buttons
    tbody.addEventListener('click', async (e) => {
      const button = e.target.closest('.action-button');
      if (!button) return;

      const id = button.dataset.id;
      if (button.classList.contains('edit-button')) {
        window.location.href = `/editor.html?id=${id}`;
      } else if (button.classList.contains('view-button')) {
        try {
          const item = await window.contentAPI.loadContentItem(id);
          // Implement view modal or navigation
          console.log('Viewing item:', item);
        } catch (error) {
          console.error('Failed to load content item:', error);
        }
      }
    });
  }

  // Initialize table
  const content = await loadContent();
  initializeFilters(content);
  setupEventListeners(content);
  renderPage(processContent(content));

  block.dataset.blockStatus = 'loaded';
}
