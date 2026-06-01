# 🚀 START HERE - Windows Setup

## ⚠️ IMPORTANT: You're seeing an error because ChromaDB server components aren't installed yet!

## Step 1: Install ChromaDB with Server Support

Open PowerShell or Command Prompt and run this command:

```powershell
pip install "chromadb[server]"
```

**IMPORTANT**: 
- Include the quotes: `"chromadb[server]"`
- Wait for installation to complete (1-2 minutes)
- You should see "Successfully installed..." messages

## Step 2: Verify Installation

After installation completes, run:

```powershell
python -c "import chromadb; print('ChromaDB installed successfully!')"
```

If you see "ChromaDB installed successfully!" - you're good to go!

## Step 3: Start ChromaDB Server

Now run:

```powershell
python start-chromadb.py
```

You should see:
```
🚀 Starting ChromaDB Server...
📍 Host: localhost
🔌 Port: 8000
INFO:     Started server process
INFO:     Uvicorn running on http://localhost:8000
```

✅ **SUCCESS!** ChromaDB is now running.

## Step 4: Continue Setup

Keep the ChromaDB window open and follow **QUICK_START_WINDOWS.md** for the remaining steps (backend & frontend).

---

## 🆘 Still Having Issues?

### Error: "pip is not recognized"
**Solution**: Install Python from https://www.python.org/downloads/
- Check "Add Python to PATH" during installation
- Restart your terminal

### Error: "No module named 'fastapi'"
**Solution**: You didn't run the install command yet!
- Run: `pip install "chromadb[server]"` (with quotes!)
- Wait for it to finish
- Then try `python start-chromadb.py` again

### Error: Installation fails
**Solution**: Try installing components separately:
```powershell
pip install fastapi
pip install uvicorn
pip install chromadb
```

### Alternative: Use Docker
If Python installation is problematic:
1. Install Docker Desktop for Windows
2. Run: `docker run -d -p 8000:8000 chromadb/chroma`
3. Follow SETUP_GUIDE.md instead

---

## ✅ Quick Checklist

- [ ] Python installed (check: `python --version`)
- [ ] Pip working (check: `pip --version`)
- [ ] Run: `pip install "chromadb[server]"`
- [ ] Wait for installation to complete
- [ ] Run: `python start-chromadb.py`
- [ ] See "Uvicorn running" message
- [ ] Continue with QUICK_START_WINDOWS.md

**Need more help?** See WINDOWS_SETUP.md for detailed troubleshooting.