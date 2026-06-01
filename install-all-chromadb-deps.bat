@echo off
echo ========================================
echo Installing ALL ChromaDB Dependencies
echo This may take 2-3 minutes...
echo ========================================
echo.

echo Step 1: Core packages...
pip install fastapi uvicorn pydantic httpx

echo.
echo Step 2: ChromaDB...
pip install chromadb

echo.
echo Step 3: OpenTelemetry packages...
pip install opentelemetry-api
pip install opentelemetry-sdk
pip install opentelemetry-instrumentation
pip install opentelemetry-instrumentation-fastapi

echo.
echo Step 4: Additional dependencies...
pip install starlette
pip install typing-extensions

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Now try: python start-chromadb.py
echo.
echo If you still get errors, PLEASE USE DOCKER instead:
echo 1. Install Docker Desktop from docker.com
echo 2. Run: docker run -d -p 8000:8000 chromadb/chroma
echo.
pause

@REM Made with Bob
