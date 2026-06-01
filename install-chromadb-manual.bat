@echo off
echo ========================================
echo Installing ChromaDB Dependencies
echo ========================================
echo.

echo Installing FastAPI...
pip install fastapi

echo.
echo Installing Uvicorn...
pip install uvicorn

echo.
echo Installing ChromaDB...
pip install chromadb

echo.
echo Installing additional dependencies...
pip install pydantic
pip install httpx
pip install opentelemetry-api
pip install opentelemetry-sdk
pip install opentelemetry-instrumentation

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Now try running: python start-chromadb.py
echo.
pause

@REM Made with Bob
