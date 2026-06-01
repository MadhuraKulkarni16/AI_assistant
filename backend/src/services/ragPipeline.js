import { getGroqLLM } from '../config/groq.js';
import { queryDocumentChunks } from './vectorStore.js';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

/**
 * Define the state schema for the RAG workflow
 */
class RAGState {
  constructor() {
    this.question = '';
    this.documentId = '';
    this.retrievedChunks = [];
    this.context = '';
    this.answer = '';
    this.sources = [];
    this.error = null;
  }
}

/**
 * Node 1: Process and refine the user query
 */
async function processQuery(state) {
  console.log('📝 Processing query...');
  
  try {
    // For now, we'll use the query as-is
    // In a more advanced implementation, you could use LLM to refine the query
    return {
      ...state,
      question: state.question.trim()
    };
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      ...state,
      error: `Query processing failed: ${error.message}`
    };
  }
}

/**
 * Node 2: Retrieve relevant chunks from ChromaDB
 */
async function retrieveChunks(state) {
  console.log('🔍 Retrieving relevant chunks...');
  
  try {
    const chunks = await queryDocumentChunks(
      state.documentId,
      state.question,
      5 // Top 5 most relevant chunks
    );
    
    return {
      ...state,
      retrievedChunks: chunks
    };
  } catch (error) {
    console.error('Error retrieving chunks:', error);
    return {
      ...state,
      error: `Retrieval failed: ${error.message}`
    };
  }
}

/**
 * Node 3: Build context from retrieved chunks
 */
async function buildContext(state) {
  console.log(' Building context...');
  
  try {
    if (!state.retrievedChunks || state.retrievedChunks.length === 0) {
      return {
        ...state,
        context: '',
        error: 'No relevant information found in the document'
      };
    }
    
    // Combine chunks into context with source information
    const contextParts = state.retrievedChunks.map((chunk, index) => {
      const pageInfo = chunk.metadata?.chunkIndex !== undefined 
        ? `[Chunk ${chunk.metadata.chunkIndex + 1}]` 
        : `[Source ${index + 1}]`;
      return `${pageInfo}\n${chunk.content}`;
    });
    
    const context = contextParts.join('\n\n---\n\n');
    
    // Extract source information
    const sources = state.retrievedChunks.map((chunk, index) => ({
      chunkIndex: chunk.metadata?.chunkIndex || index,
      content: chunk.content.substring(0, 200) + '...',
      relevanceScore: chunk.distance ? (1 - chunk.distance).toFixed(3) : 'N/A'
    }));
    
    return {
      ...state,
      context: context,
      sources: sources
    };
  } catch (error) {
    console.error('Error building context:', error);
    return {
      ...state,
      error: `Context building failed: ${error.message}`
    };
  }
}

/**
 * Node 4: Generate answer using Groq LLM
 */
async function generateAnswer(state) {
  console.log('🤖 Generating answer...');
  
  try {
    if (state.error) {
      return state; // Skip if there's an error
    }
    
    if (!state.context) {
      return {
        ...state,
        answer: "I couldn't find relevant information in the document to answer your question."
      };
    }
    
    const llm = getGroqLLM({
      temperature: 0.7,
      maxTokens: 2048
    });
    
    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context from a PDF document.

Instructions:
- Answer the question using ONLY the information from the provided context
- If the context doesn't contain enough information to answer the question, say so clearly
- Be concise but comprehensive
- Cite specific parts of the context when relevant
- If you're unsure, express your uncertainty
- Do not make up information that's not in the context`;

    const userPrompt = `Context from the document:
${state.context}

Question: ${state.question}

Please provide a clear and accurate answer based on the context above.`;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt)
    ];
    
    const response = await llm.invoke(messages);
    
    return {
      ...state,
      answer: response.content
    };
  } catch (error) {
    console.error('Error generating answer:', error);
    return {
      ...state,
      error: `Answer generation failed: ${error.message}`,
      answer: 'Sorry, I encountered an error while generating the answer.'
    };
  }
}

/**
 * Node 5: Format the final response
 */
async function formatResponse(state) {
  console.log('📋 Formatting response...');
  
  return {
    ...state,
    // Response is already formatted, just pass through
  };
}

/**
 * Execute the RAG pipeline (simplified sequential implementation)
 * @param {string} documentId - Document identifier
 * @param {string} question - User question
 * @returns {Promise<Object>} - Answer and sources
 */
export async function executeRAGPipeline(documentId, question) {
  try {
    console.log('🚀 Starting RAG pipeline...');
    console.log(`Document: ${documentId}`);
    console.log(`Question: ${question}`);
    
    // Initialize state
    let state = {
      question: question,
      documentId: documentId,
      retrievedChunks: [],
      context: '',
      answer: '',
      sources: [],
      error: null
    };
    
    // Step 1: Process Query
    state = await processQuery(state);
    if (state.error) {
      return {
        answer: 'Error processing query',
        sources: [],
        error: state.error,
        metadata: { chunksRetrieved: 0, hasContext: false }
      };
    }
    
    // Step 2: Retrieve Chunks
    state = await retrieveChunks(state);
    if (state.error) {
      return {
        answer: 'Error retrieving information',
        sources: [],
        error: state.error,
        metadata: { chunksRetrieved: 0, hasContext: false }
      };
    }
    
    // Step 3: Build Context
    state = await buildContext(state);
    
    // Step 4: Generate Answer
    state = await generateAnswer(state);
    
    // Step 5: Format Response
    state = await formatResponse(state);
    
    console.log('✅ RAG pipeline completed');
    
    return {
      answer: state.answer,
      sources: state.sources,
      error: state.error,
      metadata: {
        chunksRetrieved: state.retrievedChunks?.length || 0,
        hasContext: !!state.context
      }
    };
  } catch (error) {
    console.error('Error executing RAG pipeline:', error);
    throw new Error(`RAG pipeline failed: ${error.message}`);
  }
}

export default {
  executeRAGPipeline
};

// Made with Bob
