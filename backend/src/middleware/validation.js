/**
 * Validate PDF upload request
 */
export function validatePDFUpload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded. Please upload a PDF file.'
      }
    });
  }
  
  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid file type. Only PDF files are allowed.'
      }
    });
  }
  
  next();
}

/**
 * Validate query request
 */
export function validateQuery(req, res, next) {
  const { documentId, question } = req.body;
  
  if (!documentId) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'documentId is required'
      }
    });
  }
  
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'question is required and must be a non-empty string'
      }
    });
  }
  
  if (question.length > 1000) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'question is too long (max 1000 characters)'
      }
    });
  }
  
  next();
}

/**
 * Validate document ID parameter
 */
export function validateDocumentId(req, res, next) {
  const { documentId } = req.params;
  
  if (!documentId) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'documentId parameter is required'
      }
    });
  }
  
  next();
}

export default {
  validatePDFUpload,
  validateQuery,
  validateDocumentId
};

// Made with Bob
