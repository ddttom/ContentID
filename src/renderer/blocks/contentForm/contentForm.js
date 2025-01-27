import { loadCSS } from '../../scripts/lib.js';

export default async function decorate(block) {
  await loadCSS('/blocks/contentForm/contentForm.css');
  block.dataset.blockStatus = 'loading';

  const form = block.querySelector('.content-form');
  const saveDraftBtn = form.querySelector('.save-draft');
  const saveContentBtn = form.querySelector('.save-content');
  const cancelBtn = form.querySelector('.cancel');
  const relationshipSearch = form.querySelector('.relationship-search');
  const relationshipResults = form.querySelector('.relationship-results');

  // Form validation
  const validateForm = () => {
    const errors = [];
    const required = form.querySelectorAll('[required]');
    
    required.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group.classList.add('has-error');
        if (!group.querySelector('.error-message')) {
          const error = document.createElement('div');
          error.className = 'error-message';
          error.textContent = `${field.name} is required`;
          group.appendChild(error);
        }
        errors.push(field.name);
      } else {
        group.classList.remove('has-error');
        const error = group.querySelector('.error-message');
        if (error) error.remove();
      }
    });

    return errors.length === 0;
  };

  // Draft saving
  const DRAFT_KEY = 'contentFormDraft';
  const saveDraft = () => {
    const formData = new FormData(form);
    const draft = {};
    for (const [key, value] of formData.entries()) {
      draft[key] = value;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const loadDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const data = JSON.parse(draft);
      Object.entries(data).forEach(([key, value]) => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
          if (field.type === 'checkbox') {
            field.checked = value === 'on';
          } else {
            field.value = value;
          }
        }
      });
    }
  };

  // Auto-save draft every 30 seconds
  const autoSaveInterval = setInterval(saveDraft, 30000);

  // Relationship search
  let searchTimeout;
  const searchRelationships = async (query) => {
    if (!query.trim()) {
      relationshipResults.innerHTML = '';
      return;
    }

    try {
      const results = await window.contentAPI.searchContent(query);
      relationshipResults.innerHTML = results.map(item => `
        <div class="relationship-item" data-id="${item.id}">
          <strong>${item.title}</strong>
          <span>${item.type}</span>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to search relationships:', error);
      relationshipResults.innerHTML = '<div class="error">Failed to search content</div>';
    }
  };

  // Form submission
  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    form.dataset.loading = 'true';
    const formData = new FormData(form);
    const content = {
      id: crypto.randomUUID(),
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
      approvals: {
        legal: 'pending',
        marketing: 'pending',
        compliance: 'pending'
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
        created: formData.get('created_date'),
        validUntil: formData.get('valid_until'),
        version: formData.get('version')
      },
      relationships: Array.from(
        relationshipResults.querySelectorAll('.relationship-item[data-selected]')
      ).map(item => item.dataset.id)
    };

    try {
      await window.contentAPI.saveContent(content);
      // Clear draft after successful save
      localStorage.removeItem(DRAFT_KEY);
      window.location.href = '/list.html';
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      form.dataset.loading = 'false';
    }
  };

  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm();
  });

  saveDraftBtn.addEventListener('click', () => {
    saveDraft();
    alert('Draft saved successfully');
  });

  cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.location.href = '/list.html';
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
      item.toggleAttribute('data-selected');
      item.classList.toggle('selected');
    }
  });

  // Initialize form
  loadDraft();
  
  // Set default dates
  const createdDate = form.querySelector('#created');
  const validUntil = form.querySelector('#valid_until');
  if (!createdDate.value) {
    createdDate.value = new Date().toISOString().split('T')[0];
  }
  if (!validUntil.value) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    validUntil.value = nextYear.toISOString().split('T')[0];
  }

  // Cleanup
  block.dataset.blockStatus = 'loaded';
  window.addEventListener('beforeunload', () => {
    clearInterval(autoSaveInterval);
  });
}
