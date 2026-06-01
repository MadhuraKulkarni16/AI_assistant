import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload a PDF file
 * @param {File} file - PDF file to upload
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise<Object>}
 */
export const uploadPDF = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Query a document with a question
 * @param {string} documentId - Document identifier
 * @param {string} question - User question
 * @returns {Promise<Object>}
 */
export const queryDocument = async (documentId, question) => {
  try {
    const response = await api.post('/api/query', {
      documentId,
      question,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get document information
 * @param {string} documentId - Document identifier
 * @returns {Promise<Object>}
 */
export const getDocumentInfo = async (documentId) => {
  try {
    const response = await api.get(`/api/query/document/${documentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a document
 * @param {string} documentId - Document identifier
 * @returns {Promise<Object>}
 */
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/api/query/document/${documentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check API health
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  uploadPDF,
  queryDocument,
  getDocumentInfo,
  deleteDocument,
  checkHealth,
};

// Made with Bob
