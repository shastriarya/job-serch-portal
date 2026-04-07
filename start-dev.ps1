$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path

$frontendPath = Join-Path $workspace "frontend"
$backendPath = Join-Path $workspace "backend"
$aiPath = Join-Path $workspace "ai-service"

Write-Host "Starting AI service, backend, and frontend..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$aiPath'; python -m uvicorn app.main:app --reload --port 8000"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$backendPath'; npm run dev"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location '$frontendPath'; npm run dev"
)

Write-Host "Launched all three services in separate PowerShell windows." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "AI:       http://localhost:8000" -ForegroundColor Yellow
