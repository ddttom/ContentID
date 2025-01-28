import express from 'express';
import { contentDb } from '../db/contentDb.js';

const router = express.Router();

// Create new content
router.post('/content', async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      variation_social,
      variation_email,
      variation_print,
      block_paragraph,
      block_features,
      region_na,
      region_eu,
      region_apac,
      translatable,
      verbatim_required,
      trademark_required,
      slogan_required,
      style_font,
      style_color,
      style_spacing,
      created_date,
      valid_until,
      version,
      embargo_date,
      confidentiality,
      usage_rights,
      relationships
    } = req.body;

    // Transform form data to match database schema
    const contentData = {
      title,
      type,
      description,
      variations: {
        social: variation_social,
        email: variation_email,
        print: variation_print
      },
      blocks: {
        paragraph: block_paragraph,
        features: block_features ? block_features.split('\n').filter(f => f.trim()) : []
      },
      approvals: {
        legal: { status: 'pending', timestamp: null, approver: null },
        marketing: { status: 'pending', timestamp: null, approver: null },
        compliance: { status: 'pending', timestamp: null, approver: null }
      },
      usage: {
        regions: [
          ...(region_na ? ['NA'] : []),
          ...(region_eu ? ['EU'] : []),
          ...(region_apac ? ['APAC'] : [])
        ],
        translatable: !!translatable,
        verbatim_required: !!verbatim_required,
        restrictions: {
          embargo: embargo_date || null,
          confidentiality: confidentiality || 'public',
          usage_rights: usage_rights || 'unrestricted'
        }
      },
      brand: {
        trademark_required: !!trademark_required,
        slogan_required: !!slogan_required,
        style: {
          font: style_font || 'SF Pro Text',
          color: style_color || '#1D1D1F',
          spacing: style_spacing || 'relaxed'
        }
      },
      temporal: {
        created_date: created_date || new Date().toISOString().split('T')[0],
        valid_until: valid_until || null,
        version: parseInt(version) || 1
      },
      relationships: relationships ? relationships.map(rel => ({
        type: rel.type || 'unknown',
        id: rel.id
      })) : []
    };

    const content = await contentDb.create(contentData);
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Get content by ID
router.get('/content/:id', async (req, res) => {
  try {
    const content = await contentDb.get(parseInt(req.params.id));
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// Update content
router.put('/content/:id', async (req, res) => {
  try {
    // Transform form data similar to create endpoint
    const {
      title,
      type,
      description,
      variation_social,
      variation_email,
      variation_print,
      block_paragraph,
      block_features,
      region_na,
      region_eu,
      region_apac,
      translatable,
      verbatim_required,
      trademark_required,
      slogan_required,
      style_font,
      style_color,
      style_spacing,
      created_date,
      valid_until,
      version,
      embargo_date,
      confidentiality,
      usage_rights,
      relationships
    } = req.body;

    const updates = {
      title,
      type,
      description,
      variations: {
        social: variation_social,
        email: variation_email,
        print: variation_print
      },
      blocks: {
        paragraph: block_paragraph,
        features: block_features ? block_features.split('\n').filter(f => f.trim()) : []
      },
      usage: {
        regions: [
          ...(region_na ? ['NA'] : []),
          ...(region_eu ? ['EU'] : []),
          ...(region_apac ? ['APAC'] : [])
        ],
        translatable: !!translatable,
        verbatim_required: !!verbatim_required,
        restrictions: {
          embargo: embargo_date || null,
          confidentiality: confidentiality || 'public',
          usage_rights: usage_rights || 'unrestricted'
        }
      },
      brand: {
        trademark_required: !!trademark_required,
        slogan_required: !!slogan_required,
        style: {
          font: style_font || 'SF Pro Text',
          color: style_color || '#1D1D1F',
          spacing: style_spacing || 'relaxed'
        }
      },
      temporal: {
        created_date,
        valid_until,
        version: parseInt(version)
      },
      relationships: relationships ? relationships.map(rel => ({
        type: rel.type || 'unknown',
        id: rel.id
      })) : []
    };

    const content = await contentDb.update(parseInt(req.params.id), updates);
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// List all content
router.get('/content', async (req, res) => {
  try {
    const content = await contentDb.list();
    res.json(content);
  } catch (error) {
    console.error('Error listing content:', error);
    res.status(500).json({ error: 'Failed to list content' });
  }
});

// Delete content
router.delete('/content/:id', async (req, res) => {
  try {
    await contentDb.delete(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Verify content
router.get('/content/:id/verify', async (req, res) => {
  try {
    const isValid = await contentDb.verify(parseInt(req.params.id));
    res.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying content:', error);
    res.status(500).json({ error: 'Failed to verify content' });
  }
});

export { router as contentApi };
