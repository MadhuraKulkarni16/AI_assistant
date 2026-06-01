import express from 'express';
import { executeRAGPipeline } from '../services/ragPipeline.js';
import { documentExists, getDocumentStats, deleteDocument } from '../services/vectorStore.js';
import { validateQuery, validateDocumentId } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * POST /api/query
 * Ask a question about an uploaded PDF
 */
router.post('/', validateQuery, asyncHandler(async (req, res) => {
  const startTime = Date.now();
  const { documentId, question } = req.body;
  
  try {
    console.log('💬 Received query request');
    console.log(`Document: ${documentId}`);
    console.log(`Question: ${question}`);
    
    // Check if document exists
    const exists = await documentExists(documentId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Document not found. Please upload a PDF first.',
          documentId: documentId
        }
      });
    }
    
    // Execute RAG pipeline
    const result = await executeRAGPipeline(documentId, question);
    
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Query processed successfully in ${responseTime}s`);
    
    res.status(200).json({
      success: true,
      data: {
        answer: result.answer,
        sources: result.sources,
        metadata: {
          ...result.metadata,
          responseTime: `${responseTime}s`,
          documentId: documentId
        }
      }
    });
    
  } catch (error) {
    console.error('Error processing query:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process query',
        details: error.message
      }
    });
  }
}));

/**
 * GET /api/query/document/:documentId
 * Get document information
 */
router.get('/document/:documentId', validateDocumentId, asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  
  try {
    const exists = await documentExists(documentId);
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Document not found',
          documentId: documentId
        }
      });
    }
    
    const stats = await getDocumentStats(documentId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error getting document info:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get document information',
        details: error.message
      }
    });
  }
}));

/**
 * DELETE /api/query/document/:documentId
 * Delete a document and its embeddings
 */
router.delete('/document/:documentId', validateDocumentId, asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  
  try {
    const exists = await documentExists(documentId);
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Document not found',
          documentId: documentId
        }
      });
    }
    
    await deleteDocument(documentId);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        documentId: documentId
      }
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete document',
        details: error.message
      }
    });
  }
}));

/**
 * GET /api/query/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'Query Service',
      status: 'operational',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;

// Made with Bob
