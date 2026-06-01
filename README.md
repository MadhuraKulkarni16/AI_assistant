# PDF Q&A Assistant

A powerful PDF question-answering assistant built with **LangGraph**, **RAG (Retrieval-Augmented Generation)**, **ChromaDB**, and **Groq**. Upload any PDF document and ask questions about its content using AI-powered natural language processing.

## 🌟 Features

- **📄 PDF Upload & Processing**: Upload PDF files and automatically extract and process text
- **🤖 AI-Powered Q&A**: Ask questions in natural language and get accurate answers
- **🔍 Smart Retrieval**: Uses RAG with ChromaDB vector search for relevant context retrieval
- **⚡ Fast Responses**: Powered by Groq for lightning-fast LLM inference
- **📊 Source Citations**: View the exact chunks of text used to generate answers
- **🎯 Context-Aware**: LangGraph workflow ensures coherent and contextual responses
- **💬 Chat Interface**: Interactive chat UI for seamless conversation

## 🏗️ Architecture

```
┌─────────────┐
│   React UI  │
│  (Frontend) │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│   Express API    │
│   (Backend)      │
└────────┬─────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│ ChromaDB│ │ Groq API     │
│ Vectors │ │ (LLM)        │
└─────────┘ └──────────────┘
         │
         ↓
   ┌──────────┐
   │LangGraph │
   │ Pipeline │
   └──────────┘
```

### Technology Stack

**Backend:**
- Node.js + Express
- LangChain & LangGraph for workflow orchestration
- ChromaDB for vector storage
- Groq for LLM inference
- pdf-parse for PDF text extraction

**Frontend:**
- React.js with Vite
- Axios for API calls
- React Dropzone for file uploads
- Custom styled components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** (for ChromaDB)
- **Groq API Key** ([Get one here](https://console.groq.com))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pdf-qa-assistant
```

### 2. Set Up ChromaDB

Start ChromaDB using Docker:

```bash
docker run -d -p 8000:8000 chromadb/chroma
```

Verify ChromaDB is running:
```bash
curl http://localhost:8000/api/v1/heartbeat
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_groq_api_key_here
```

**Configure `.env` file:**

```env
PORT=3001
NODE_ENV=development

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# ChromaDB Configuration
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHROMA_COLLECTION_NAME=pdf_documents

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Model Configuration
GROQ_MODEL=llama3-70b-8192
EMBEDDING_MODEL=nomic-embed-text

# Chunking Configuration
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

**Start the backend server:**

```bash
npm run dev
```

The backend will start on `http://localhost:3001`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📖 Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Upload a PDF**:
   - Drag and drop a PDF file or click to select
   - Wait for the file to be processed (text extraction + embedding generation)

3. **Ask Questions**:
   - Type your question in the chat input
   - Press Enter or click Send
   - View the AI-generated answer with source citations

4. **Upload New Document**:
   - Click "Upload New Document" to start over with a different PDF

## 🔧 API Endpoints

### Backend API

**Base URL:** `http://localhost:3001`

#### Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data

Body: { pdf: <file> }

Response: {
  "success": true,
  "data": {
    "documentId": "doc_uuid",
    "filename": "example.pdf",
    "numPages": 10,
    "totalChunks": 45,
    "processingTime": "5.23s"
  }
}
```

#### Query Document
```http
POST /api/query
Content-Type: application/json

Body: {
  "documentId": "doc_uuid",
  "question": "What is the main topic?"
}

Response: {
  "success": true,
  "data": {
    "answer": "The main topic is...",
    "sources": [...],
    "metadata": {
      "chunksRetrieved": 5,
      "responseTime": "1.2s"
    }
  }
}
```

#### Get Document Info
```http
GET /api/query/document/:documentId

Response: {
  "success": true,
  "data": {
    "documentId": "doc_uuid",
    "totalChunks": 45
  }
}
```

#### Delete Document
```http
DELETE /api/query/document/:documentId

Response: {
  "success": true,
  "message": "Document deleted successfully"
}
```

#### Health Check
```http
GET /health

Response: {
  "success": true,
  "data": {
    "service": "PDF Q&A Assistant API",
    "status": "operational"
  }
}
```

## 🎯 How It Works

### RAG Pipeline (LangGraph Workflow)

The application uses a sophisticated RAG pipeline orchestrated by LangGraph:

1. **Query Processing**: User question is analyzed and refined
2. **Retrieval**: ChromaDB searches for the most relevant document chunks using vector similarity
3. **Context Building**: Retrieved chunks are combined with metadata
4. **Answer Generation**: Groq LLM generates a contextual answer based on retrieved information
5. **Response Formatting**: Final answer is formatted with source citations

### PDF Processing Flow

1. **Upload**: PDF file is uploaded via multipart/form-data
2. **Text Extraction**: `pdf-parse` extracts text from all pages
3. **Chunking**: Text is split into overlapping chunks (1000 tokens, 200 overlap)
4. **Embedding**: Each chunk is converted to vector embeddings using Groq
5. **Storage**: Embeddings are stored in ChromaDB with metadata
6. **Ready**: Document is ready for querying

## ⚙️ Configuration

### Groq Models

Available models (configure in `.env`):

- `llama3-70b-8192` - Most capable, best for complex reasoning (default)
- `llama3-8b-8192` - Faster responses, good for simple queries
- `mixtral-8x7b-32768` - Large context window for long documents
- `gemma-7b-it` - Efficient for general tasks

### Chunking Strategy

Adjust in `.env`:
- `CHUNK_SIZE`: Size of each text chunk (default: 1000)
- `CHUNK_OVERLAP`: Overlap between chunks (default: 200)

### File Upload Limits

- Maximum file size: 10MB (configurable via `MAX_FILE_SIZE`)
- Supported format: PDF only

## 🐳 Docker Deployment (Optional)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  chromadb:
    image: chromadb/chroma
    ports:
      - "8000:8000"
    volumes:
      - chromadb_data:/chroma/chroma

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - CHROMA_HOST=chromadb
      - CHROMA_PORT=8000
    depends_on:
      - chromadb
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  chromadb_data:
```

Run with:
```bash
docker-compose up -d
```

## 🔍 Troubleshooting

### ChromaDB Connection Issues

**Error:** `Failed to connect to ChromaDB`

**Solution:**
```bash
# Check if ChromaDB is running
docker ps | grep chroma

# Restart ChromaDB
docker restart <chromadb-container-id>

# Check logs
docker logs <chromadb-container-id>
```

### Groq API Errors

**Error:** `GROQ_API_KEY is not set`

**Solution:**
- Ensure `.env` file exists in backend directory
- Verify your API key is valid at https://console.groq.com
- Restart the backend server after updating `.env`

### PDF Upload Fails

**Error:** `File size exceeds maximum allowed size`

**Solution:**
- Check file size (max 10MB by default)
- Increase `MAX_FILE_SIZE` in `.env` if needed
- Ensure file is a valid PDF

### Port Already in Use

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Find process using the port
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# Kill the process or change PORT in .env
```

## 📚 Project Structure

```
pdf-qa-assistant/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── chromadb.js      # ChromaDB configuration
│   │   │   └── groq.js          # Groq LLM configuration
│   │   ├── services/
│   │   │   ├── pdfProcessor.js  # PDF parsing & chunking
│   │   │   ├── vectorStore.js   # ChromaDB operations
│   │   │   └── ragPipeline.js   # LangGraph RAG workflow
│   │   ├── routes/
│   │   │   ├── upload.js        # PDF upload endpoint
│   │   │   └── query.js         # Q&A endpoint
│   │   ├── middleware/
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   └── validation.js    # Input validation
│   │   └── server.js            # Express app
│   ├── uploads/                 # Uploaded PDFs
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFUploader.jsx  # File upload UI
│   │   │   ├── ChatInterface.jsx # Chat UI
│   │   │   └── MessageList.jsx  # Message display
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [LangChain](https://www.langchain.com/) for the AI framework
- [LangGraph](https://github.com/langchain-ai/langgraph) for workflow orchestration
- [ChromaDB](https://www.trychroma.com/) for vector storage
- [Groq](https://groq.com/) for fast LLM inference
- [React](https://react.dev/) for the frontend framework

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Built with ❤️ using LangGraph, RAG, ChromaDB, and Groq**