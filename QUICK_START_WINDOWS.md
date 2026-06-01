# ⚡ Quick Start Guide for Windows

Follow these simple steps to get your PDF Q&A Assistant running on Windows.

## Step 1: Install ChromaDB with Server Support

**Option A: Double-click the batch file**
```
Double-click: install-chromadb.bat
```

**Option B: Run in PowerShell**
```powershell
pip install "chromadb[server]"
```

⏳ Wait for installation to complete (may take 1-2 minutes)

## Step 2: Start ChromaDB Server

Open PowerShell or Command Prompt and run:

```powershell
python start-chromadb.py
```

You should see:
```
🚀 Starting ChromaDB Server...
📍 Host: localhost
🔌 Port: 8000
```

✅ **Keep this window open!** ChromaDB is now running.

## Step 3: Setup Backend

Open a **NEW** PowerShell/Command Prompt window:

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Edit .env file
notepad .env
```

In notepad, add your Groq API key:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

Save and close, then start the backend:

```powershell
npm run dev
```

You should see:
```
✅ ChromaDB connected successfully
✅ Server started successfully!
🌐 Server running on http://localhost:3001
```

✅ **Keep this window open!** Backend is now running.

## Step 4: Setup Frontend

Open **ANOTHER NEW** PowerShell/Command Prompt window:

```powershell
# Navigate to frontend folder
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

✅ **Keep this window open!** Frontend is now running.

## Step 5: Use the Application

1. Open your browser
2. Go to: `http://localhost:5173`
3. Upload a PDF file (drag & drop or click)
4. Wait for processing (you'll see progress)
5. Ask questions about your PDF!

## 🎉 You're Done!

You now have 3 windows running:
- **Window 1**: ChromaDB Server
- **Window 2**: Backend API
- **Window 3**: Frontend UI

## 🛑 To Stop

Press `Ctrl+C` in each window to stop the services.

## ❓ Troubleshooting

### "pip is not recognized"
- Install Python from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Cannot find module 'fastapi'"
- Run: `pip install "chromadb[server]"` (with quotes!)

### ChromaDB won't start
- Make sure you installed with: `pip install "chromadb[server]"`
- Try: `python -m chromadb.cli.cli run --host localhost --port 8000`

### Backend can't connect to ChromaDB
- Make sure ChromaDB window is still running
- Check if `http://localhost:8000/api/v1/heartbeat` opens in browser

### Need Groq API Key
- Go to: https://console.groq.com
- Sign up/Login
- Create an API key
- Copy it to backend/.env file

## 📚 More Help

- See **WINDOWS_SETUP.md** for detailed instructions
- See **README.md** for complete documentation
- Check error messages in the terminal windows

---

**Happy PDF Querying!** 🚀