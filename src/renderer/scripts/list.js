// Content list management
let currentPage = 1;
const itemsPerPage = 10;
let contentItems = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  setupEventListeners();
});

// Load content from API
async function loadContent() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) throw new Error('Failed to fetch content');
    
    contentItems = await response.json();
    updateTable();
    updatePagination();
  } catch (error) {
    console.error('Error loading content:', error);
    // TODO: Show error message to user
  }
}

// Setup event listeners
function setupEventListeners() {
  // Add entry button
  document.getElementById('add-entry').addEventListener('click', () => {
    window.location.href = 'entry.html';
  });

  // Search input
  document.querySelector('.search-input').addEventListener('input', (e) => {
    filterContent();
  });

  // Filter selects
  document.querySelector('.filter-type').addEventListener('change', filterContent);
  document.querySelector('.filter-status').addEventListener('change', filterContent);

  // Pagination
  document.querySelector('.prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
      updatePagination();
    }
  });

  document.querySelector('.next-page').addEventListener('click', () => {
    const maxPages = Math.ceil(contentItems.length / itemsPerPage);
    if (currentPage < maxPages) {
      currentPage++;
      updateTable();
      updatePagination();
    }
  });
}

// Filter content based on search and filters
function filterContent() {
  const searchTerm = document.querySelector('.search-input').value.toLowerCase();
  const typeFilter = document.querySelector('.filter-type').value;
  const statusFilter = document.querySelector('.filter-status').value;

  const filtered = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                         item.description.toLowerCase().includes(searchTerm);
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesStatus = !statusFilter || getOverallStatus(item.approvals) === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  currentPage = 1;
  updateTable(filtered);
  updatePagination(filtered);
}

// Get overall approval status
function getOverallStatus(approvals) {
  if (!approvals) return 'pending';
  
  const statuses = Object.values(approvals).map(a => a.status);
  if (statuses.includes('rejected')) return 'rejected';
  if (statuses.includes('pending')) return 'pending';
  return 'approved';
}

// Update table with content
function updateTable(items = contentItems) {
  const tbody = document.querySelector('.content-table tbody');
  tbody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = items.slice(start, end);

  pageItems.forEach(item => {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');
    
    row.innerHTML = `
      <td role="cell">${item.id}</td>
      <td role="cell">${item.title}</td>
      <td role="cell">${item.type}</td>
      <td role="cell">${getOverallStatus(item.approvals)}</td>
      <td role="cell">${new Date(item.temporal.created_date).toLocaleDateString()}</td>
      <td role="cell">${item.temporal.valid_until ? new Date(item.temporal.valid_until).toLocaleDateString() : 'N/A'}</td>
      <td role="cell" class="actions">
        <button class="edit-button" aria-label="Edit ${item.title}" onclick="editContent(${item.id})">
          Edit
        </button>
        <button class="delete-button" aria-label="Delete ${item.title}" onclick="deleteContent(${item.id})">
          Delete
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Update pagination controls
function updatePagination(items = contentItems) {
  const maxPages = Math.ceil(items.length / itemsPerPage);
  document.querySelector('.current-page').textContent = currentPage;
  
  document.querySelector('.prev-page').disabled = currentPage === 1;
  document.querySelector('.next-page').disabled = currentPage === maxPages;
}

// Edit content
async function editContent(id) {
  window.location.href = `entry.html?id=${id}`;
}

// Delete content
async function deleteContent(id) {
  if (!confirm('Are you sure you want to delete this content?')) return;

  try {
    const response = await fetch(`/api/content/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete content');
    
    await loadContent(); // Reload the list
  } catch (error) {
    console.error('Error deleting content:', error);
    // TODO: Show error message to user
  }
}

// Make functions available to onclick handlers
window.editContent = editContent;
window.deleteContent = deleteContent;
