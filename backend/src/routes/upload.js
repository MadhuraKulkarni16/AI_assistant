import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { processPDF, cleanupFile } from '../services/pdfProcessor.js';
import { storeDocumentChunks } from '../services/vectorStore.js';
import { validatePDFUpload } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

/**
 * POST /api/upload
 * Upload and process a PDF file
 */
router.post('/', upload.single('pdf'), validatePDFUpload, asyncHandler(async (req, res) => {
  const startTime = Date.now();
  let documentId = null;
  
  try {
    console.log('📤 Received PDF upload request');
    console.log(`File: ${req.file.originalname} (${req.file.size} bytes)`);
    
    // Generate unique document ID
    documentId = `doc_${uuidv4()}`;
    
    // Process PDF: extract text and split into chunks
    const { chunks, totalChunks, numPages, metadata } = await processPDF(req.file.path);
    
    // Store chunks in ChromaDB with embeddings
    const storageResult = await storeDocumentChunks(documentId, chunks);
    
    // Clean up uploaded file (optional - comment out if you want to keep files)
    // await cleanupFile(req.file.path);
    
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`✅ PDF processed successfully in ${processingTime}s`);
    
    res.status(200).json({
      success: true,
      data: {
        documentId: documentId,
        filename: req.file.originalname,
        fileSize: req.file.size,
        numPages: numPages,
        totalChunks: totalChunks,
        processingTime: `${processingTime}s`,
        collectionName: storageResult.collectionName
      },
      message: 'PDF uploaded and processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing PDF upload:', error);
    
    // Clean up file on error
    if (req.file && req.file.path) {
      await cleanupFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process PDF',
        details: error.message
      }
    });
  }
}));

/**
 * GET /api/upload/status
 * Check upload service status
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'PDF Upload Service',
      status: 'operational',
      maxFileSize: `${(parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024}MB`,
      supportedFormats: ['PDF']
    }
  });
});

export default router;

// Made with Bob
