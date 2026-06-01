import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Suppress ENOENT errors from LangChain test files
const originalConsoleError = console.error;
console.error = (...args) => {
  const errorString = args.join(' ');
  if (errorString.includes('ENOENT') && errorString.includes('test/data')) {
    // Suppress test file errors from LangChain packages
    return;
  }
  originalConsoleError.apply(console, args);
};

// Import routes and middleware
import uploadRoutes from './routes/upload.js';
import queryRoutes from './routes/query.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { getChromaClient } from './config/chromadb.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'PDF Q&A Assistant API',
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/query', queryRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize ChromaDB connection and start server
async function startServer() {
  try {
    console.log('🚀 Starting PDF Q&A Assistant Server...');
    console.log('📋 Environment:', process.env.NODE_ENV || 'development');
    
    // Test ChromaDB connection
    console.log('🔌 Connecting to ChromaDB...');
    await getChromaClient();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('✅ Server started successfully!');
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation:`);
      console.log(`   - Health Check: GET http://localhost:${PORT}/health`);
      console.log(`   - Upload PDF: POST http://localhost:${PORT}/api/upload`);
      console.log(`   - Query PDF: POST http://localhost:${PORT}/api/query`);
      console.log(`   - Get Document Info: GET http://localhost:${PORT}/api/query/document/:documentId`);
      console.log(`   - Delete Document: DELETE http://localhost:${PORT}/api/query/document/:documentId`);
      console.log('');
      console.log('💡 Make sure ChromaDB is running on http://localhost:8000');
      console.log('💡 Set your GROQ_API_KEY in the .env file');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure ChromaDB is running: docker run -p 8000:8000 chromadb/chroma');
    console.error('2. Check your .env file has GROQ_API_KEY set');
    console.error('3. Verify all dependencies are installed: npm install');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;

// Made with Bob
