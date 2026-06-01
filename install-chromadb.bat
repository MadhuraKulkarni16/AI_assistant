@echo off
echo ========================================
echo Installing ChromaDB with Server Support
echo ========================================
echo.

pip install "chromadb[server]"

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Now you can start ChromaDB with:
echo   python start-chromadb.py
echo.
pause

@REM Made with Bob
