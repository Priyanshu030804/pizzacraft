# Admin Dashboard Startup Script
Write-Host "Starting Admin Dashboard..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you have Node.js and npm installed" -ForegroundColor Yellow
Write-Host ""

Set-Location "c:\Users\venka\Downloads\pizza vamsi\admin-dashboard"

Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host ""
Write-Host "Starting development server on port 3001..." -ForegroundColor Blue
npm run dev

Read-Host "Press Enter to continue..."
