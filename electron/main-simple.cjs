const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Better dev detection - check if dist folder exists and if we have a dev server
const distExists = fs.existsSync(path.join(__dirname, '../dist/index.html'));
const isDev = !app.isPackaged && !distExists;

console.log('🔍 Development mode detection:');
console.log('  - app.isPackaged:', app.isPackaged);
console.log('  - dist exists:', distExists);
console.log('  - isDev:', isDev);

let mainWindow;

function createWindow() {
  console.log('🚀 Creating Electron window...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Temporarily disable for local dev
    },
    show: false // Don't show until ready
  });

  // Load the app
  const url = isDev 
    ? 'http://localhost:5174' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
    
  console.log('📡 Loading URL:', url);
  
  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready to show');
    mainWindow.show();
    
    // Always show dev tools to debug the white screen
    mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Disable security warnings for development
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.whenReady().then(() => {
  console.log('🚀 Electron app ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

console.log('📦 Electron main process started');
