// Form handling for content entry
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.content-form');
  const formStatus = document.getElementById('form-status');

  const showStatus = (message, isError = false) => {
    formStatus.textContent = message;
    formStatus.className = `status-message ${isError ? 'error' : 'success'}`;
    formStatus.setAttribute('aria-live', 'polite');
  };

  // Format features list from textarea
  const formatFeatures = (featuresText) => {
    return featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);
  };

  // Format form data to match API schema
  const formatFormData = (formData) => {
    const regions = [];
    if (formData.get('region_na')) regions.push('NA');
    if (formData.get('region_eu')) regions.push('EU');
    if (formData.get('region_apac')) regions.push('APAC');

    return {
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
        features: formatFeatures(formData.get('block_features') || '')
      },
      usage: {
        regions,
        translatable: formData.get('translatable') === 'on',
        verbatim_required: formData.get('verbatim_required') === 'on',
        restrictions: {
          embargo: formData.get('embargo_date'),
          confidentiality: formData.get('confidentiality') || 'public',
          usage_rights: formData.get('usage_rights') || 'unrestricted'
        }
      },
      brand: {
        trademark_required: formData.get('trademark_required') === 'on',
        slogan_required: formData.get('slogan_required') === 'on',
        style: {
          font: formData.get('style_font') || 'SF Pro Text',
          color: formData.get('style_color') || '#1D1D1F',
          spacing: formData.get('style_spacing') || 'relaxed'
        }
      },
      temporal: {
        created_date: formData.get('created_date'),
        valid_until: formData.get('valid_until'),
        version: parseInt(formData.get('version')) || 1
      },
      relationships: []  // Will be populated by relationship selection
    };
  };

  // Handle draft saving
  const saveDraft = async (formData) => {
    try {
      const data = formatFormData(formData);
      data.status = 'draft';

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to save draft');
      
      const result = await response.json();
      showStatus('Draft saved successfully');
      return result;
    } catch (error) {
      console.error('Error saving draft:', error);
      showStatus('Failed to save draft', true);
      throw error;
    }
  };

  // Handle form submission
  const submitContent = async (formData) => {
    try {
      const data = formatFormData(formData);
      data.status = 'pending';

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to submit content');
      
      const result = await response.json();
      showStatus('Content submitted successfully');
      return result;
    } catch (error) {
      console.error('Error submitting content:', error);
      showStatus('Failed to submit content', true);
      throw error;
    }
  };

  // Handle save draft button
  document.querySelector('.save-draft')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await saveDraft(formData);
    } catch (error) {
      // Error already handled in saveDraft
    }
  });

  // Handle form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await submitContent(formData);
      // Optionally redirect to list page after successful submission
      // window.location.href = 'list.html';
    } catch (error) {
      // Error already handled in submitContent
    }
  });

  // Handle cancel button
  document.querySelector('.cancel')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      window.location.href = 'list.html';
    }
  });

  // Handle relationship search
  const searchInput = document.querySelector('.relationship-search');
  const resultsContainer = document.getElementById('relationship-results');
  let selectedRelationships = [];

  searchInput?.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }

    try {
      const response = await fetch(`/api/content?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      resultsContainer.innerHTML = results
        .map(item => `
          <div class="search-result" role="option" data-id="${item.id}" data-type="${item.type}">
            <span class="title">${item.title}</span>
            <span class="type">${item.type}</span>
          </div>
        `)
        .join('');
    } catch (error) {
      console.error('Search error:', error);
      resultsContainer.innerHTML = '<div class="error">Search failed</div>';
    }
  });

  // Handle search result selection
  resultsContainer?.addEventListener('click', (e) => {
    const result = e.target.closest('.search-result');
    if (!result) return;

    const id = result.dataset.id;
    const type = result.dataset.type;
    
    // Add to selected relationships if not already present
    if (!selectedRelationships.some(r => r.id === id)) {
      selectedRelationships.push({ id, type });
      // Update relationships display
      updateRelationshipsDisplay();
    }
  });

  // Update relationships display
  const updateRelationshipsDisplay = () => {
    const container = document.querySelector('.selected-relationships');
    if (!container) return;

    container.innerHTML = selectedRelationships
      .map(rel => `
        <div class="relationship" data-id="${rel.id}">
          <span class="type">${rel.type}</span>
          <span class="id">${rel.id}</span>
          <button type="button" class="remove-relationship" aria-label="Remove relationship">×</button>
        </div>
      `)
      .join('');
  };

  // Handle relationship removal
  document.querySelector('.selected-relationships')?.addEventListener('click', (e) => {
    if (e.target.matches('.remove-relationship')) {
      const relationship = e.target.closest('.relationship');
      const id = relationship.dataset.id;
      selectedRelationships = selectedRelationships.filter(r => r.id !== id);
      updateRelationshipsDisplay();
    }
  });
});
