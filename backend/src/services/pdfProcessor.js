import pdf from 'pdf-parse';
import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import dotenv from 'dotenv';

dotenv.config();

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE) || 1000;
const CHUNK_OVERLAP = parseInt(process.env.CHUNK_OVERLAP) || 200;

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<Object>} - Extracted text and metadata
 */
export async function extractTextFromPDF(filePath) {
  try {
    console.log(`📄 Extracting text from: ${filePath}`);
    
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    
    const metadata = {
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      version: data.version,
      text: data.text,
      extractedAt: new Date().toISOString()
    };
    
    console.log(`✅ Extracted ${data.text.length} characters from ${data.numpages} pages`);
    
    return {
      text: data.text,
      numPages: data.numpages,
      metadata: metadata
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Split text into chunks for embedding
 * @param {string} text - Text to split
 * @param {Object} options - Chunking options
 * @returns {Promise<Array>} - Array of text chunks
 */
export async function splitTextIntoChunks(text, options = {}) {
  try {
    const {
      chunkSize = CHUNK_SIZE,
      chunkOverlap = CHUNK_OVERLAP,
      separators = ['\n\n', '\n', '. ', ' ', '']
    } = options;
    
    console.log(`✂️ Splitting text into chunks (size: ${chunkSize}, overlap: ${chunkOverlap})`);
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: chunkSize,
      chunkOverlap: chunkOverlap,
      separators: separators
    });
    
    const chunks = await textSplitter.splitText(text);
    
    console.log(`✅ Created ${chunks.length} chunks`);
    
    return chunks;
  } catch (error) {
    console.error('Error splitting text:', error);
    throw new Error(`Failed to split text: ${error.message}`);
  }
}

/**
 * Process PDF file: extract text and split into chunks
 * @param {string} filePath - Path to the PDF file
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Processed chunks and metadata
 */
export async function processPDF(filePath, options = {}) {
  try {
    console.log(`🔄 Processing PDF: ${filePath}`);
    
    // Extract text from PDF
    const { text, numPages, metadata } = await extractTextFromPDF(filePath);
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }
    
    // Split text into chunks
    const chunks = await splitTextIntoChunks(text, options);
    
    // Add metadata to each chunk
    const chunksWithMetadata = chunks.map((chunk, index) => ({
      content: chunk,
      metadata: {
        chunkIndex: index,
        totalChunks: chunks.length,
        source: filePath,
        numPages: numPages,
        chunkSize: chunk.length
      }
    }));
    
    console.log(`✅ PDF processing complete: ${chunks.length} chunks created`);
    
    return {
      chunks: chunksWithMetadata,
      totalChunks: chunks.length,
      numPages: numPages,
      originalText: text,
      metadata: metadata
    };
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

/**
 * Clean up uploaded file
 * @param {string} filePath - Path to the file to delete
 */
export async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️ Cleaned up file: ${filePath}`);
  } catch (error) {
    console.error('Error cleaning up file:', error);
    // Don't throw error for cleanup failures
  }
}

/**
 * Validate PDF file
 * @param {Object} file - Multer file object
 * @returns {boolean}
 */
export function validatePDFFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.mimetype !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }
  
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB default
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
  }
  
  return true;
}

export default {
  extractTextFromPDF,
  splitTextIntoChunks,
  processPDF,
  cleanupFile,
  validatePDFFile
};

// Made with Bob
