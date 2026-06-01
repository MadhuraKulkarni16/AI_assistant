import { getOrCreateCollection } from '../config/chromadb.js';
import { getGroqEmbeddings } from '../config/groq.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Store document chunks in ChromaDB
 * @param {string} documentId - Unique identifier for the document
 * @param {Array} chunks - Array of text chunks with metadata
 * @returns {Promise<Object>} - Storage result
 */
export async function storeDocumentChunks(documentId, chunks) {
  try {
    console.log(`💾 Storing ${chunks.length} chunks for document: ${documentId}`);
    
    // Get or create collection for this document
    const collection = await getOrCreateCollection(documentId);
    
    // Get embeddings model
    const embeddings = getGroqEmbeddings();
    
    // Prepare data for ChromaDB
    const ids = [];
    const documents = [];
    const metadatas = [];
    const embeddingsArray = [];
    
    // Generate embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkId = `${documentId}_chunk_${i}`;
      
      console.log(`🔢 Generating embedding for chunk ${i + 1}/${chunks.length}`);
      
      // Generate embedding
      const embedding = await embeddings.embedQuery(chunk.content);
      
      ids.push(chunkId);
      documents.push(chunk.content);
      metadatas.push({
        ...chunk.metadata,
        documentId: documentId,
        chunkId: chunkId
      });
      embeddingsArray.push(embedding);
    }
    
    // Add to ChromaDB collection
    await collection.add({
      ids: ids,
      embeddings: embeddingsArray,
      documents: documents,
      metadatas: metadatas
    });
    
    console.log(`✅ Successfully stored ${chunks.length} chunks in ChromaDB`);
    
    return {
      success: true,
      documentId: documentId,
      chunksStored: chunks.length,
      collectionName: documentId
    };
  } catch (error) {
    console.error('Error storing document chunks:', error);
    throw new Error(`Failed to store document chunks: ${error.message}`);
  }
}

/**
 * Query ChromaDB for relevant chunks
 * @param {string} documentId - Document identifier
 * @param {string} query - User query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} - Relevant chunks
 */
export async function queryDocumentChunks(documentId, query, topK = 5) {
  try {
    console.log(`🔍 Querying document ${documentId} with: "${query}"`);
    
    // Get collection
    const collection = await getOrCreateCollection(documentId);
    
    // Get embeddings model
    const embeddings = getGroqEmbeddings();
    
    // Generate query embedding
    const queryEmbedding = await embeddings.embedQuery(query);
    
    // Query ChromaDB
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK
    });
    
    // Format results
    const relevantChunks = [];
    if (results.documents && results.documents[0]) {
      for (let i = 0; i < results.documents[0].length; i++) {
        relevantChunks.push({
          content: results.documents[0][i],
          metadata: results.metadatas[0][i],
          distance: results.distances[0][i],
          id: results.ids[0][i]
        });
      }
    }
    
    console.log(`✅ Found ${relevantChunks.length} relevant chunks`);
    
    return relevantChunks;
  } catch (error) {
    console.error('Error querying document chunks:', error);
    throw new Error(`Failed to query document: ${error.message}`);
  }
}

/**
 * Get document statistics from ChromaDB
 * @param {string} documentId - Document identifier
 * @returns {Promise<Object>} - Document statistics
 */
export async function getDocumentStats(documentId) {
  try {
    const collection = await getOrCreateCollection(documentId);
    const count = await collection.count();
    
    return {
      documentId: documentId,
      totalChunks: count,
      collectionName: documentId
    };
  } catch (error) {
    console.error('Error getting document stats:', error);
    throw error;
  }
}

/**
 * Delete document from ChromaDB
 * @param {string} documentId - Document identifier
 * @returns {Promise<boolean>}
 */
export async function deleteDocument(documentId) {
  try {
    const { deleteCollection } = await import('../config/chromadb.js');
    await deleteCollection(documentId);
    console.log(`🗑️ Deleted document: ${documentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Check if document exists in ChromaDB
 * @param {string} documentId - Document identifier
 * @returns {Promise<boolean>}
 */
export async function documentExists(documentId) {
  try {
    console.log(`🔍 Checking if document exists: ${documentId}`);
    const { getChromaClient } = await import('../config/chromadb.js');
    const client = await getChromaClient();
    
    // Try to get the collection directly
    try {
      await client.getCollection({ name: documentId });
      console.log(`✅ Document ${documentId} exists`);
      return true;
    } catch (error) {
      console.log(`❌ Document ${documentId} does not exist`);
      return false;
    }
  } catch (error) {
    console.error('Error checking document existence:', error);
    // Return true to allow the query to proceed and fail with a better error message
    console.warn('⚠️ Assuming document exists due to check error');
    return true;
  }
}

export default {
  storeDocumentChunks,
  queryDocumentChunks,
  getDocumentStats,
  deleteDocument,
  documentExists
};

// Made with Bob
