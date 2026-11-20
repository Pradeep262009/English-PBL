@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================================
echo   Pushing English PBL Presentation to GitHub
echo ========================================================
echo Repo: https://github.com/pblpayaluga/ENGLISH-PBL.git
echo.

set "GIT_CMD=git"
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    if exist "%LOCALAPPDATA%\MinGit\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\MinGit\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    ) else (
        echo [!] Git is being set up. Please try again in 10 seconds.
        pause
        exit /b 1
    )
)

echo [*] Initializing Git repository...
"%GIT_CMD%" init
"%GIT_CMD%" config user.name "pblpayaluga"
"%GIT_CMD%" config user.email "pblpayaluga@users.noreply.github.com"

echo [*] Staging all presentation files...
"%GIT_CMD%" add -A

echo [*] Committing files...
"%GIT_CMD%" commit -m "Add The Great Derangement English PBL presentation website"

echo [*] Setting main branch...
"%GIT_CMD%" branch -M main

echo [*] Setting remote origin...
"%GIT_CMD%" remote remove origin >nul 2>&1
"%GIT_CMD%" remote add origin https://github.com/pblpayaluga/ENGLISH-PBL.git

echo.
echo [*] Pushing to GitHub...
echo (If prompted, sign in via browser or paste your GitHub token)
echo.
"%GIT_CMD%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo [SUCCESS] Code pushed successfully to:
    echo https://github.com/pblpayaluga/ENGLISH-PBL
    echo ========================================================
) else (
    echo.
    echo [NOTE] If GitHub asked for a password, use a Personal Access Token:
    echo https://github.com/settings/tokens
)

echo.
pause
