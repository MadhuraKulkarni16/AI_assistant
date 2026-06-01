#!/usr/bin/env python3
"""
ChromaDB Server Starter Script
This script starts a ChromaDB server on localhost:8000
"""

import sys

try:
    import chromadb
    from chromadb.config import Settings
    print("✅ ChromaDB package found")
except ImportError:
    print("❌ ChromaDB not installed. Installing now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "chromadb"])
    import chromadb
    from chromadb.config import Settings
    print("✅ ChromaDB installed successfully")

def start_server():
    """Start ChromaDB server"""
    print("\n🚀 Starting ChromaDB Server...")
    print("📍 Host: localhost")
    print("🔌 Port: 8000")
    print("\n💡 Press Ctrl+C to stop the server\n")
    
    try:
        # Import the CLI module
        from chromadb.cli.cli import app
        import uvicorn
        
        # Start the server
        uvicorn.run(
            "chromadb.app:app",
            host="localhost",
            port=8000,
            log_level="info"
        )
    except ImportError:
        print("\n⚠️  ChromaDB CLI not available. Using alternative method...\n")
        
        # Alternative: Use HTTP server directly
        try:
            from chromadb.server.fastapi import FastAPI
            import uvicorn
            
            app = FastAPI(Settings())
            uvicorn.run(app, host="localhost", port=8000)
        except Exception as e:
            print(f"\n❌ Error starting server: {e}")
            print("\n📝 Alternative: Install ChromaDB with server support:")
            print("   pip install chromadb[server]")
            sys.exit(1)

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n\n👋 ChromaDB server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n📝 Troubleshooting:")
        print("   1. Make sure Python 3.8+ is installed")
        print("   2. Try: pip install chromadb")
        print("   3. Or: pip install 'chromadb[server]'")
        sys.exit(1)

# Made with Bob
