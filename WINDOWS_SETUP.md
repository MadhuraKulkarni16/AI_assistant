# 🪟 Windows Setup Guide (Without Docker)

This guide helps you set up the PDF Q&A Assistant on Windows without Docker.

## Prerequisites

- ✅ Node.js v18+ ([Download](https://nodejs.org/))
- ✅ Python 3.8+ ([Download](https://www.python.org/downloads/))
- ✅ Groq API Key ([Get one](https://console.groq.com))

## Option 1: ChromaDB via Python (Recommended)

### Step 1: Install ChromaDB Server

Open PowerShell or Command Prompt:

```powershell
# Install ChromaDB with server support (IMPORTANT!)
pip install "chromadb[server]"
```

**Wait for installation to complete**, then start the server:

```powershell
# Start ChromaDB server using the provided Python script
python start-chromadb.py
```

**Alternative method if the script doesn't work:**
```powershell
# Start using Python module directly
python -m chromadb.cli.cli run --host localhost --port 8000
```

Keep this terminal open. ChromaDB will run on `http://localhost:8000`

**Verify it's running:** Open `http://localhost:8000/api/v1/heartbeat` in your browser - you should see `{"nanosecond heartbeat": ...}`

### Step 2: Backend Setup

Open a **new** PowerShell/Command Prompt:

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env file with notepad
notepad .env
```

**Add your Groq API key in the .env file:**
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

Save and close notepad, then start the backend:

```powershell
npm run dev
```

You should see:
```
✅ ChromaDB connected successfully
✅ Server started successfully!
🌐 Server running on http://localhost:3001
```

### Step 3: Frontend Setup

Open **another new** PowerShell/Command Prompt:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
VITE v6.0.3  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 4: Test the Application

1. Open your browser to `http://localhost:5173`
2. Upload a PDF file
3. Wait for processing
4. Ask questions about the PDF

## Option 2: Using ChromaDB Python Package Directly

If you prefer not to run a separate ChromaDB server, you can modify the backend to use ChromaDB's HTTP client mode.

### Install ChromaDB with HTTP support:

```powershell
pip install chromadb-client
```

Then follow Steps 2-4 from Option 1.

## Option 3: Install Docker Desktop (Alternative)

If you want to use Docker:

1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Install and restart your computer
3. Start Docker Desktop
4. Follow the main [SETUP_GUIDE.md](SETUP_GUIDE.md)

## Troubleshooting

### ChromaDB won't start

**Error**: `pip: command not found`

**Solution**: 
```powershell
# Verify Python is installed
python --version

# If not found, download from https://www.python.org/downloads/
# Make sure to check "Add Python to PATH" during installation
```

**Error**: `chroma: command not found`

**Solution**:
```powershell
# Use the provided Python script
python start-chromadb.py

# Or try with python -m
python -m chromadb.cli.cli run --host localhost --port 8000

# Or install with server support
pip install "chromadb[server]"
```

### Port Already in Use

**Error**: `Port 8000 is already in use`

**Solution**:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port in backend/.env:
# CHROMA_PORT=8001
```

### Backend Connection Issues

**Error**: `Failed to connect to ChromaDB`

**Solution**:
1. Verify ChromaDB is running: Open `http://localhost:8000/api/v1/heartbeat` in browser
2. Check firewall settings
3. Ensure CHROMA_HOST=localhost and CHROMA_PORT=8000 in backend/.env

### npm install fails

**Error**: `npm: command not found`

**Solution**:
```powershell
# Verify Node.js is installed
node --version
npm --version

# If not found, download from https://nodejs.org/
```

## Running All Services

You'll need **3 terminal windows**:

**Terminal 1 - ChromaDB:**
```powershell
python start-chromadb.py
```

**Terminal 2 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Stopping Services

Press `Ctrl+C` in each terminal to stop the services.

## Alternative: Use VS Code Integrated Terminal

1. Open VS Code
2. Open 3 terminal tabs (Terminal → New Terminal)
3. Run each service in a separate tab

## Quick Commands Reference

```powershell
# Check if services are running
# ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Backend
curl http://localhost:3001/health

# Frontend - open in browser
start http://localhost:5173
```

## Environment Variables

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
CHROMA_HOST=localhost
CHROMA_PORT=8000
CHROMA_COLLECTION_NAME=pdf_documents
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
GROQ_MODEL=llama3-70b-8192
EMBEDDING_MODEL=nomic-embed-text
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
```

**Frontend (.env)** - Optional:
```env
VITE_API_URL=http://localhost:3001
```

## Next Steps

- Upload a test PDF and try asking questions
- Check the [README.md](README.md) for API documentation
- Explore different Groq models in backend/.env
- Review logs in terminals for debugging

## Need More Help?

- Ensure all prerequisites are installed
- Check that all 3 services are running
- Verify your Groq API key is valid
- Review error messages in terminal windows

---

**Windows Setup Complete!** 🎉 Your PDF Q&A Assistant is ready to use!