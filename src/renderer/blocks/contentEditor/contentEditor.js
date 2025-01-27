import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/contentEditor/contentEditor.css');
  block.dataset.blockStatus = 'loading';

  const form = block.querySelector('.content-form');
  const versionNumber = block.querySelector('.version-number');
  const viewHistoryBtn = block.querySelector('.view-history');
  const historyModal = block.querySelector('.history-modal');
  const closeModalBtn = block.querySelector('.close-modal');
  const historyList = block.querySelector('.history-list');
  const updateBtn = block.querySelector('.update-content');
  const deleteBtn = block.querySelector('.delete-content');
  const cancelBtn = block.querySelector('.cancel');
  const relationshipSearch = block.querySelector('.relationship-search');
  const relationshipResults = block.querySelector('.relationship-results');
  const selectedRelationships = block.querySelector('.selected-relationships');

  // Get content ID from URL
  const params = new URLSearchParams(window.location.search);
  const contentId = params.get('id');
  if (!contentId) {
    window.location.href = '/list.html';
    return;
  }

  // Load content data
  let currentContent;
  try {
    currentContent = await window.contentAPI.loadContentItem(contentId);
    if (!currentContent) {
      throw new Error('Content not found');
    }
  } catch (error) {
    console.error('Failed to load content:', error);
    alert('Failed to load content. Redirecting to list page.');
    window.location.href = '/list.html';
    return;
  }

  // Populate form fields
  function populateForm(content) {
    // Basic fields
    form.querySelector('#title').value = content.title;
    form.querySelector('#type').value = content.type;
    form.querySelector('#description').value = content.description;

    // Variations
    form.querySelector('[name="variation_social"]').value = content.variations.social;
    form.querySelector('[name="variation_email"]').value = content.variations.email;
    form.querySelector('[name="variation_print"]').value = content.variations.print;

    // Content blocks
    form.querySelector('#paragraph').value = content.blocks.paragraph;
    form.querySelector('#features').value = content.blocks.features;

    // Approvals
    Object.entries(content.approvals).forEach(([type, status]) => {
      const statusEl = form.querySelector(`[data-status="${status}"]`);
      if (statusEl) {
        statusEl.dataset.status = status;
        statusEl.querySelector('.status-text').textContent = status;
        if (content.approvalDetails?.[type]) {
          statusEl.querySelector('.approver').textContent = content.approvalDetails[type].approver;
          statusEl.querySelector('.approval-date').textContent = 
            new Date(content.approvalDetails[type].date).toLocaleDateString();
        }
      }
    });

    // Usage parameters
    content.usage.regions.forEach(region => {
      const checkbox = form.querySelector(`[name="region_${region.toLowerCase()}"]`);
      if (checkbox) checkbox.checked = true;
    });
    form.querySelector('#translatable').checked = content.usage.translatable;
    form.querySelector('#verbatim').checked = content.usage.verbatimRequired;

    // Brand requirements
    form.querySelector('#trademark').checked = content.brand.trademark;
    form.querySelector('#slogan').checked = content.brand.slogan;
    form.querySelector('[name="style_font"]').value = content.brand.style.font;
    form.querySelector('[name="style_color"]').value = content.brand.style.color;
    form.querySelector('[name="style_spacing"]').value = content.brand.style.spacing;

    // Temporal context
    form.querySelector('#created').value = content.temporal.created;
    form.querySelector('#valid_until').value = content.temporal.validUntil;
    form.querySelector('#version').value = content.temporal.version;
    versionNumber.textContent = `v${content.temporal.version}`;

    // Relationships
    updateSelectedRelationships(content.relationships);
  }

  // Version history
  async function loadVersionHistory() {
    try {
      const history = await window.contentAPI.getContentHistory(contentId);
      historyList.innerHTML = history.map(version => `
        <div class="history-item">
          <div class="version">Version ${version.version}</div>
          <div class="timestamp">${new Date(version.timestamp).toLocaleString()}</div>
          <div class="changes">${version.changes.join(', ')}</div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load version history:', error);
      historyList.innerHTML = '<div class="error">Failed to load version history</div>';
    }
  }

  // Relationship management
  let searchTimeout;
  async function searchRelationships(query) {
    if (!query.trim()) {
      relationshipResults.innerHTML = '';
      return;
    }

    try {
      const results = await window.contentAPI.searchContent(query);
      relationshipResults.innerHTML = results
        .filter(item => item.id !== contentId)
        .map(item => `
          <div class="relationship-item" data-id="${item.id}">
            <strong>${item.title}</strong>
            <span>${item.type}</span>
          </div>
        `).join('');
    } catch (error) {
      console.error('Failed to search relationships:', error);
      relationshipResults.innerHTML = '<div class="error">Failed to search content</div>';
    }
  }

  function updateSelectedRelationships(relationships) {
    selectedRelationships.innerHTML = relationships.map(rel => `
      <div class="selected-relationship" data-id="${rel.id}">
        <span>${rel.title}</span>
        <button type="button" class="remove-relationship">&times;</button>
      </div>
    `).join('');
  }

  // Form submission
  async function updateContent(e) {
    e.preventDefault();

    if (!confirm('Are you sure you want to update this content?')) {
      return;
    }

    form.dataset.loading = 'true';
    const formData = new FormData(form);
    const updatedContent = {
      ...currentContent,
      title: formData.get('title'),
      type: formData.get('type'),
      description: formData.get('description'),
      variations: {
        social: formData.get('variation_social'),
        email: formData.get('variation_email'),
        print: formData.get('variation_print')
      },
      blocks: {
        paragraph: formData.get('block_paragraph'),
        features: formData.get('block_features')
      },
      usage: {
        regions: ['NA', 'EU', 'APAC'].filter(region => 
          formData.get(`region_${region.toLowerCase()}`)
        ),
        translatable: formData.get('translatable') === 'on',
        verbatimRequired: formData.get('verbatim_required') === 'on'
      },
      brand: {
        trademark: formData.get('trademark_required') === 'on',
        slogan: formData.get('slogan_required') === 'on',
        style: {
          font: formData.get('style_font'),
          color: formData.get('style_color'),
          spacing: formData.get('style_spacing')
        }
      },
      temporal: {
        ...currentContent.temporal,
        validUntil: formData.get('valid_until'),
        version: String(Number(currentContent.temporal.version) + 1)
      }
    };

    try {
      await window.contentAPI.updateContent(updatedContent);
      window.location.href = '/list.html';
    } catch (error) {
      console.error('Failed to update content:', error);
      alert('Failed to update content. Please try again.');
    } finally {
      form.dataset.loading = 'false';
    }
  }

  // Delete content
  async function deleteContent() {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      await window.contentAPI.deleteContent(contentId);
      window.location.href = '/list.html';
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content. Please try again.');
    }
  }

  // Event listeners
  viewHistoryBtn.addEventListener('click', () => {
    historyModal.hidden = false;
    loadVersionHistory();
  });

  closeModalBtn.addEventListener('click', () => {
    historyModal.hidden = true;
  });

  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
      historyModal.hidden = true;
    }
  });

  relationshipSearch.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchRelationships(e.target.value);
    }, 300);
  });

  relationshipResults.addEventListener('click', (e) => {
    const item = e.target.closest('.relationship-item');
    if (item) {
      const id = item.dataset.id;
      const title = item.querySelector('strong').textContent;
      currentContent.relationships.push({ id, title });
      updateSelectedRelationships(currentContent.relationships);
      relationshipResults.innerHTML = '';
      relationshipSearch.value = '';
    }
  });

  selectedRelationships.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-relationship');
    if (removeBtn) {
      const relationship = removeBtn.closest('.selected-relationship');
      const id = relationship.dataset.id;
      currentContent.relationships = currentContent.relationships.filter(rel => rel.id !== id);
      updateSelectedRelationships(currentContent.relationships);
    }
  });

  form.addEventListener('submit', updateContent);
  deleteBtn.addEventListener('click', deleteContent);
  cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      window.location.href = '/list.html';
    }
  });

  // Initialize
  populateForm(currentContent);
  block.dataset.blockStatus = 'loaded';
}
