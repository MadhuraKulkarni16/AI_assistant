import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

const CHROMA_HOST = process.env.CHROMA_HOST || 'localhost';
const CHROMA_PORT = process.env.CHROMA_PORT || '8000';

let chromaClient = null;

/**
 * Initialize ChromaDB client
 * @returns {Promise<ChromaClient>}
 */
export async function getChromaClient() {
  if (!chromaClient) {
    try {
      chromaClient = new ChromaClient({
        path: `http://${CHROMA_HOST}:${CHROMA_PORT}`
      });
      
      // Test connection
      await chromaClient.heartbeat();
      console.log('✅ ChromaDB connected successfully');
    } catch (error) {
      console.error('❌ ChromaDB connection failed:', error.message);
      throw new Error('Failed to connect to ChromaDB. Make sure ChromaDB is running.');
    }
  }
  return chromaClient;
}

/**
 * Get or create a collection for a document
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Collection>}
 */
export async function getOrCreateCollection(collectionName) {
  try {
    const client = await getChromaClient();
    
    // Try to get existing collection
    try {
      const collection = await client.getCollection({ name: collectionName });
      console.log(`📚 Using existing collection: ${collectionName}`);
      return collection;
    } catch (error) {
      // Collection doesn't exist, create it
      const collection = await client.createCollection({
        name: collectionName,
        metadata: { 
          description: 'PDF document embeddings',
          created_at: new Date().toISOString()
        }
      });
      console.log(`📚 Created new collection: ${collectionName}`);
      return collection;
    }
  } catch (error) {
    console.error('Error getting/creating collection:', error);
    throw error;
  }
}

/**
 * Delete a collection
 * @param {string} collectionName - Name of the collection to delete
 */
export async function deleteCollection(collectionName) {
  try {
    const client = await getChromaClient();
    await client.deleteCollection({ name: collectionName });
    console.log(`🗑️ Deleted collection: ${collectionName}`);
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
}

/**
 * List all collections
 * @returns {Promise<Array>}
 */
export async function listCollections() {
  try {
    const client = await getChromaClient();
    const collections = await client.listCollections();
    return collections;
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
}

export default {
  getChromaClient,
  getOrCreateCollection,
  deleteCollection,
  listCollections
};

// Made with Bob
