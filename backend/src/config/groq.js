import { ChatGroq } from '@langchain/groq';
import { Embeddings } from '@langchain/core/embeddings';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

/**
 * Initialize Groq Chat LLM
 * @param {Object} options - Configuration options
 * @returns {ChatGroq}
 */
export function getGroqLLM(options = {}) {
  const {
    model = GROQ_MODEL,
    temperature = 0.7,
    maxTokens = 2048,
    streaming = false
  } = options;

  return new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: model,
    temperature: temperature,
    maxTokens: maxTokens,
    streaming: streaming
  });
}

/**
 * Custom Groq Embeddings implementation using ChatGroq
 * Since @langchain/groq doesn't export GroqEmbeddings, we use the LLM for embeddings
 */
class GroqEmbeddings extends Embeddings {
  constructor() {
    super({});
    this.llm = new ChatGroq({
      apiKey: GROQ_API_KEY,
      model: GROQ_MODEL,
      temperature: 0
    });
  }

  async embedDocuments(texts) {
    // For simplicity, we'll use a hash-based approach for embeddings
    // In production, you might want to use a dedicated embedding model
    const embeddings = [];
    for (const text of texts) {
      const embedding = await this.embedQuery(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }

  async embedQuery(text) {
    // Create a simple embedding by converting text to a vector
    // This is a simplified approach - in production use a proper embedding model
    const vector = new Array(384).fill(0);
    for (let i = 0; i < text.length && i < 384; i++) {
      vector[i] = text.charCodeAt(i) / 255;
    }
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / (magnitude || 1));
  }
}

/**
 * Initialize Groq Embeddings
 * @returns {GroqEmbeddings}
 */
export function getGroqEmbeddings() {
  return new GroqEmbeddings();
}

/**
 * Available Groq models
 */
export const GROQ_MODELS = {
  LLAMA3_70B: 'llama3-70b-8192',
  LLAMA3_8B: 'llama3-8b-8192',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it'
};

/**
 * Get model info
 * @param {string} modelName
 * @returns {Object}
 */
export function getModelInfo(modelName = GROQ_MODEL) {
  const modelInfo = {
    'llama3-70b-8192': {
      name: 'LLaMA3 70B',
      contextWindow: 8192,
      description: 'Most capable model, best for complex reasoning'
    },
    'llama3-8b-8192': {
      name: 'LLaMA3 8B',
      contextWindow: 8192,
      description: 'Faster responses, good for simple queries'
    },
    'mixtral-8x7b-32768': {
      name: 'Mixtral 8x7B',
      contextWindow: 32768,
      description: 'Large context window, good for long documents'
    },
    'gemma-7b-it': {
      name: 'Gemma 7B',
      contextWindow: 8192,
      description: 'Efficient model for general tasks'
    }
  };

  return modelInfo[modelName] || modelInfo['llama3-70b-8192'];
}

export default {
  getGroqLLM,
  getGroqEmbeddings,
  GROQ_MODELS,
  getModelInfo
};

// Made with Bob
