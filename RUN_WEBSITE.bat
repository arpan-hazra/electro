@echo off
title QuartzLab 3D - Launching Website
echo ========================================================
echo   Starting QuartzLab 3D - by Arpan
echo   Electronic 3D Models, Projects ^& Learning Hub
echo ========================================================
echo.
echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/
echo.
echo Starting local web server (keep this window open)...
call npm run dev
pause
