@echo off
setlocal
echo ===========================================
echo   Final Push Helper - The Craft House
echo ===========================================
echo.
echo I will reset your Git repo and push the 
echo SECURED version of your code.
echo.
echo [1/5] Removing old Git data...
cd /d "c:\Users\Admin\crafted-whispers-shop"
if exist .git (
    rmdir /s /q .git
)

echo [2/5] Initializing fresh Repo...
git init

echo [3/5] Staging all files...
git add .

echo [4/5] Creating Initial Commit...
echo Emails Whitelisted: 12432383@students.liu.edu.lb, housecraft442@gmail.com
git config user.email "12432383@students.liu.edu.lb"
git config user.name "12432383-sudo"
git commit -m "Initial commit - Secured Full App Rewrite"

echo [5/5] Connecting to GitHub and Pushing...
git remote add origin https://github.com/12432383-sudo/housecraft-shop.git
git branch -M main
echo.
echo A login window or terminal prompt MAY appear.
echo Please follow the instructions to authenticate.
echo.
git push -u origin main --force

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] The push failed. 
    echo Please make sure you signed into GitHub in the popup.
) else (
    echo.
    echo [SUCCESS] Your code is live on GitHub!
    echo Check: https://github.com/12432383-sudo/housecraft-shop.git
)

echo.
echo ===========================================
echo   Press any key to close this window.
echo ===========================================
pause >nul
