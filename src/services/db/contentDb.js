import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'content.json');

class ContentDb {
  constructor() {
    this.data = null;
    this.initialized = false;
  }

  async init() {
    try {
      const content = await fs.readFile(DB_PATH, 'utf-8');
      this.data = JSON.parse(content);
      this.initialized = true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Create new DB file if it doesn't exist
        this.data = {
          content: [],
          metadata: {
            lastId: 0,
            version: '1.0.0'
          }
        };
        await this.save();
        this.initialized = true;
      } else {
        throw error;
      }
    }
  }

  async save() {
    await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  generateHash(content) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(content))
      .digest('hex');
  }

  generateSignature(content, privateKey = 'development-key') {
    // In production, this would use proper key management
    return crypto
      .createHmac('sha256', privateKey)
      .update(JSON.stringify(content))
      .digest('hex');
  }

  processFeatures(features) {
    // Convert features string to array if needed
    if (typeof features === 'string') {
      return features.split('\n').filter(f => f.trim());
    }
    return Array.isArray(features) ? features : [];
  }

  async create(contentData) {
    if (!this.initialized) await this.init();

    const id = ++this.data.metadata.lastId;
    const timestamp = new Date().toISOString();

    // Process features as array
    if (contentData.blocks && contentData.blocks.features) {
      contentData.blocks.features = this.processFeatures(contentData.blocks.features);
    }

    // Create content hash and signature
    const contentHash = this.generateHash(contentData);
    const digitalSignature = this.generateSignature(contentData);

    // Format relationships
    const relationships = (contentData.relationships || []).map(rel => ({
      type: rel.type || 'unknown',
      id: rel.id || rel.toString()
    }));

    const content = {
      id,
      ...contentData,
      usage: {
        ...contentData.usage,
        restrictions: {
          embargo: contentData.usage?.restrictions?.embargo || null,
          confidentiality: contentData.usage?.restrictions?.confidentiality || 'public',
          usage_rights: contentData.usage?.restrictions?.usage_rights || 'unrestricted'
        }
      },
      relationships,
      verification: {
        digital_signature: digitalSignature,
        content_hash: contentHash,
        trust_chain: [{
          authority: 'system',
          signature: this.generateSignature(contentHash),
          timestamp
        }],
        status: 'pending'
      },
      audit: {
        created_at: timestamp,
        updated_at: timestamp,
        created_by: 'system',
        version_history: [{
          version: 1,
          timestamp,
          changes: 'Initial creation',
          editor: 'system'
        }]
      }
    };

    this.data.content.push(content);
    await this.save();
    return content;
  }

  async update(id, updates) {
    if (!this.initialized) await this.init();

    const index = this.data.content.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Content not found');

    const content = this.data.content[index];
    const timestamp = new Date().toISOString();

    // Process features if updated
    if (updates.blocks && updates.blocks.features) {
      updates.blocks.features = this.processFeatures(updates.blocks.features);
    }

    // Format relationships if updated
    if (updates.relationships) {
      updates.relationships = updates.relationships.map(rel => ({
        type: rel.type || 'unknown',
        id: rel.id || rel.toString()
      }));
    }

    // Update content and generate new hash/signature
    const updatedContent = {
      ...content,
      ...updates,
      temporal: {
        ...content.temporal,
        version: content.temporal.version + 1
      }
    };

    // Ensure restrictions structure
    if (updates.usage) {
      updatedContent.usage.restrictions = {
        ...content.usage.restrictions,
        ...updates.usage.restrictions
      };
    }

    updatedContent.verification = {
      ...updatedContent.verification,
      content_hash: this.generateHash(updatedContent),
      digital_signature: this.generateSignature(updatedContent),
      trust_chain: [
        ...updatedContent.verification.trust_chain,
        {
          authority: 'system',
          signature: this.generateSignature(this.generateHash(updatedContent)),
          timestamp
        }
      ]
    };

    updatedContent.audit.updated_at = timestamp;
    updatedContent.audit.version_history.push({
      version: updatedContent.temporal.version,
      timestamp,
      changes: 'Content update',
      editor: 'system'
    });

    this.data.content[index] = updatedContent;
    await this.save();
    return updatedContent;
  }

  async get(id) {
    if (!this.initialized) await this.init();
    return this.data.content.find(item => item.id === id);
  }

  async list() {
    if (!this.initialized) await this.init();
    return this.data.content;
  }

  async delete(id) {
    if (!this.initialized) await this.init();
    
    const index = this.data.content.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Content not found');

    this.data.content.splice(index, 1);
    await this.save();
  }

  async verify(id) {
    if (!this.initialized) await this.init();

    const content = await this.get(id);
    if (!content) throw new Error('Content not found');

    const currentHash = this.generateHash(content);
    return currentHash === content.verification.content_hash;
  }
}

// Export singleton instance
const contentDb = new ContentDb();
export { contentDb };
