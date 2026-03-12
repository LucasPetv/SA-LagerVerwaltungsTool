@echo off
echo Stopping any running InventoryPro processes...
taskkill /F /IM "InventoryPro Analytics.exe" 2>nul
timeout 2 >nul

echo Building new portable version...
cd /d "C:\Users\Lucas\Desktop\01_Sören\electron-v1"
call npm run build

echo Creating portable package...
call npx electron-packager . "InventoryPro Analytics" --platform=win32 --arch=x64 --out=release --overwrite

echo.
echo Build complete!
echo Location: release\InventoryPro Analytics-win32-x64\InventoryPro Analytics.exe
echo.
pause
