const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { Groq } = require('groq-sdk');
const VectorDB = require('../utils/vectorDB');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Initialize Vector DB
const vectorDB = new VectorDB();

const parseCV = async (filePath, fileType) => {
  try {
    let extractedText = '';
    
    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (fileType === 'docx' || fileType === 'doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      throw new Error('Unsupported file type');
    }
    
    return extractedText.trim();
  } catch (error) {
    throw new Error(`Failed to parse CV: ${error.message}`);
  }
};

const generateEmbeddings = async (text) => {
  try {
    // Split text into chunks to avoid token limits
    const chunks = splitTextIntoChunks(text, 1000);
    const embeddings = [];
    
    // For now, let's use a simple mock embedding since Groq might not have embeddings API
    // In production, you'd use OpenAI's embedding API or another embedding service
    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Mock embedding - replace this with actual embedding API call
      const mockEmbedding = new Array(1536).fill(0).map(() => Math.random() - 0.5);
      
      embeddings.push({
        text: chunk,
        embedding: mockEmbedding,
        chunkIndex: i
      });
      
      console.log(`Generated embedding for chunk ${i + 1}/${chunks.length}`);
    }
    
    return embeddings;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
};

const splitTextIntoChunks = (text, maxLength) => {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';
  
  for (const word of words) {
    if ((currentChunk + ' ' + word).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, path: filePath, mimetype } = req.file;
    const fileExtension = path.extname(filename).toLowerCase().slice(1);
    
    // Validate file type
    const allowedTypes = ['pdf', 'doc', 'docx'];
    if (!allowedTypes.includes(fileExtension)) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' 
      });
    }

    // Parse CV content
    const extractedText = await parseCV(filePath, fileExtension);
    
    if (!extractedText || extractedText.length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: 'CV content is too short or could not be extracted' 
      });
    }

    // Generate embeddings
    const embeddings = await generateEmbeddings(extractedText);
    
    // Store in Vector DB
    const cvData = {
      id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      filename: filename,
      originalText: extractedText,
      uploadedAt: new Date(),
      userId: req.user ? req.user.id : 'anonymous', // Handle missing user
      embeddings: embeddings
    };
    
    await vectorDB.store(cvData);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      message: 'CV uploaded and processed successfully',
      cvId: cvData.id,
      textLength: extractedText.length,
      chunksCreated: embeddings.length
    });

  } catch (error) {
    console.error('CV upload error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      message: 'Failed to process CV',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.searchCVs = async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Generate mock embedding for search query (replace with real embedding API)
    const queryEmbedding = new Array(1536).fill(0).map(() => Math.random() - 0.5);

    // Search in Vector DB
    const results = await vectorDB.search(queryEmbedding, parseInt(limit));
    
    res.status(200).json({
      message: 'Search completed successfully',
      query: query,
      results: results
    });

  } catch (error) {
    console.error('CV search error:', error);
    res.status(500).json({
      message: 'Failed to search CVs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getAllCVs = async (req, res) => {
  try {
    const cvs = await vectorDB.getAllCVs();
    
    res.status(200).json({
      message: 'CVs retrieved successfully',
      count: cvs.length,
      cvs: cvs.map(cv => ({
        id: cv.id,
        filename: cv.filename,
        uploadedAt: cv.uploadedAt,
        textLength: cv.originalText ? cv.originalText.length : 0
      }))
    });

  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({
      message: 'Failed to retrieve CVs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
