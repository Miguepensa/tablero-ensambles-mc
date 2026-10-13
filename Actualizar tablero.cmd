@echo off
cd /d "%~dp0"
"%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" tools\update-dashboard.py
if errorlevel 1 pause
