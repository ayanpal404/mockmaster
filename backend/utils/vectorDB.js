const fs = require('fs');
const path = require('path');

class VectorDB {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/vector_db.json');
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  ensureDataDirectory() {
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const rawData = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(rawData);
      }
      return { cvs: [] };
    } catch (error) {
      console.error('Error loading vector DB:', error);
      return { cvs: [] };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving vector DB:', error);
      throw new Error('Failed to save data to vector database');
    }
  }

  async store(cvData) {
    try {
      // Check if CV with same ID already exists
      const existingIndex = this.data.cvs.findIndex(cv => cv.id === cvData.id);
      
      if (existingIndex !== -1) {
        // Update existing CV
        this.data.cvs[existingIndex] = cvData;
      } else {
        // Add new CV
        this.data.cvs.push(cvData);
      }
      
      this.saveData();
      return cvData.id;
    } catch (error) {
      throw new Error(`Failed to store CV data: ${error.message}`);
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] * vecA[i];
      magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  async search(queryEmbedding, limit = 5) {
    try {
      const results = [];

      // Search through all CV chunks
      for (const cv of this.data.cvs) {
        if (!cv.embeddings || !Array.isArray(cv.embeddings)) {
          continue;
        }

        for (const chunk of cv.embeddings) {
          if (!chunk.embedding || !Array.isArray(chunk.embedding)) {
            continue;
          }

          const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
          
          results.push({
            cvId: cv.id,
            filename: cv.filename,
            uploadedAt: cv.uploadedAt,
            chunkText: chunk.text,
            similarity: similarity,
            fullText: cv.originalText // Include full text for context
          });
        }
      }

      // Sort by similarity (highest first) and limit results
      results.sort((a, b) => b.similarity - a.similarity);
      return results.slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to search vector database: ${error.message}`);
    }
  }

  async getAllCVs() {
    try {
      return this.data.cvs.map(cv => ({
        id: cv.id,
        filename: cv.filename,
        uploadedAt: cv.uploadedAt,
        originalText: cv.originalText,
        chunksCount: cv.embeddings ? cv.embeddings.length : 0
      }));
    } catch (error) {
      throw new Error(`Failed to get all CVs: ${error.message}`);
    }
  }

  async deleteCV(cvId) {
    try {
      const initialLength = this.data.cvs.length;
      this.data.cvs = this.data.cvs.filter(cv => cv.id !== cvId);
      
      if (this.data.cvs.length === initialLength) {
        throw new Error('CV not found');
      }
      
      this.saveData();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete CV: ${error.message}`);
    }
  }

  async getCVById(cvId) {
    try {
      const cv = this.data.cvs.find(cv => cv.id === cvId);
      if (!cv) {
        throw new Error('CV not found');
      }
      return cv;
    } catch (error) {
      throw new Error(`Failed to get CV: ${error.message}`);
    }
  }
}

module.exports = VectorDB;
