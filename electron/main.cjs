const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const { pathToFileURL } = require('url');
const http = require('http');
const fs = require('fs');

// Einfache isDev-Prüfung ohne externe Dependency
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

// Database Service für Main Process
let DatabaseService;
let dbInstance;

// Dynamically import mysql2 only in main process
async function initializeDatabase() {
  try {
    const mysql = await import('mysql2/promise');
    
    class MainDatabaseService {
      constructor() {
        this.connection = null;
        this.config = {
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'inventory_db',
          port: 3306
        };
      }

      async connect() {
        try {
          this.connection = await mysql.createConnection(this.config);
          console.log('✅ Database connected in main process');
          return { success: true, message: 'Verbindung hergestellt' };
        } catch (error) {
          console.error('❌ Database connection failed:', error);
          return { success: false, message: error.message };
        }
      }

      async disconnect() {
        if (this.connection) {
          await this.connection.end();
          this.connection = null;
          console.log('🔌 Database disconnected');
          return { success: true, message: 'Verbindung getrennt' };
        }
      }

      async authenticateUser(username, password, ipAddress = '', userAgent = '') {
        if (!this.connection) {
          return { success: false, message: 'Keine Datenbankverbindung' };
        }

        try {
          // Benutzer finden
          const [userRows] = await this.connection.execute(`
            SELECT id, username, email, role, full_name, company, active, last_login, 
                   login_attempts, locked_until
            FROM users 
            WHERE username = ? AND active = TRUE
          `, [username]);

          if (userRows.length === 0) {
            await this.logLoginAttempt(username, false, 'Benutzer nicht gefunden', ipAddress, userAgent);
            return { success: false, message: 'Ungültige Anmeldedaten' };
          }

          const user = userRows[0];

          // Prüfe ob Account gesperrt ist
          if (user.locked_until && new Date() < new Date(user.locked_until)) {
            await this.logLoginAttempt(username, false, 'Account gesperrt', ipAddress, userAgent);
            return { success: false, message: 'Account temporär gesperrt' };
          }

          // Demo-Passwort-Prüfung (in Produktion: bcrypt verwenden)
          let validPassword = false;
          if (username === 'admin' && password === 'admin123') validPassword = true;
          if (username === 'demo_kunde' && password === 'kunde123') validPassword = true;

          if (!validPassword) {
            await this.logLoginAttempt(username, false, 'Falsches Passwort', ipAddress, userAgent);
            return { success: false, message: 'Ungültige Anmeldedaten' };
          }

          // Erfolgreiche Anmeldung
          await this.logLoginAttempt(username, true, null, ipAddress, userAgent);
          
          // Berechtigungen laden
          const permissions = await this.getUserPermissions(user.id);

          return {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              full_name: user.full_name,
              company: user.company,
              active: user.active,
              last_login: user.last_login
            },
            permissions,
            message: 'Anmeldung erfolgreich'
          };

        } catch (error) {
          console.error('Auth error:', error);
          return { success: false, message: 'Systemfehler bei der Anmeldung' };
        }
      }

      async logLoginAttempt(username, success, failureReason, ipAddress, userAgent) {
        if (!this.connection) return;
        
        try {
          await this.connection.execute(`
            CALL UserLogin(?, ?, ?, ?, ?)
          `, [username, ipAddress, userAgent, success, failureReason || '']);
        } catch (error) {
          console.error('Error logging login attempt:', error);
        }
      }

      async getUserPermissions(userId) {
        if (!this.connection) return [];

        try {
          const [permissionRows] = await this.connection.execute(`
            SELECT p.name 
            FROM permissions p
            JOIN user_permissions up ON p.id = up.permission_id
            WHERE up.user_id = ?
          `, [userId]);

          return permissionRows.map(row => row.name);
        } catch (error) {
          console.error('Error loading permissions:', error);
          return [];
        }
      }

      async getAllUsers() {
        if (!this.connection) return [];

        try {
          const [userRows] = await this.connection.execute(`
            SELECT id, username, email, role, full_name, company, active, 
                   last_login, created_at
            FROM users 
            ORDER BY created_at DESC
          `);
          return userRows;
        } catch (error) {
          console.error('Error loading users:', error);
          return [];
        }
      }

      async getLoginHistory(limit = 20) {
        if (!this.connection) return [];

        try {
          const [historyRows] = await this.connection.execute(`
            SELECT username, login_time, ip_address, success, failure_reason
            FROM login_history 
            ORDER BY login_time DESC 
            LIMIT ?
          `, [limit]);
          return historyRows;
        } catch (error) {
          console.error('Error loading login history:', error);
          return [];
        }
      }

      updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
      }
    }

    DatabaseService = MainDatabaseService;
    dbInstance = new DatabaseService();
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// IPC Handlers für Database-Operationen
function setupDatabaseIPC() {
  // Datenbankverbindung
  ipcMain.handle('db-connect', async (event, config) => {
    if (!dbInstance) return { success: false, message: 'Database service not available' };
    
    if (config) {
      dbInstance.updateConfig(config);
    }
    
    return await dbInstance.connect();
  });

  // Datenbankverbindung trennen
  ipcMain.handle('db-disconnect', async () => {
    if (!dbInstance) return { success: false, message: 'Database service not available' };
    return await dbInstance.disconnect();
  });

  // Benutzer authentifizieren
  ipcMain.handle('db-auth-user', async (event, username, password, ipAddress, userAgent) => {
    if (!dbInstance) return { success: false, message: 'Database service not available' };
    return await dbInstance.authenticateUser(username, password, ipAddress, userAgent);
  });

  // Alle Benutzer laden
  ipcMain.handle('db-get-users', async () => {
    if (!dbInstance) return [];
    return await dbInstance.getAllUsers();
  });

  // Login-Historie laden
  ipcMain.handle('db-get-login-history', async (event, limit) => {
    if (!dbInstance) return [];
    return await dbInstance.getLoginHistory(limit);
  });
}

// Erstelle das Hauptfenster
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'InventoryPro Analytics - Advanced KPI Suite',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: false,
      backgroundThrottling: false,
      experimentalFeatures: false
    },
    show: false,
    // 🎨 MENÜ UND DESIGN ANPASSUNGEN
    autoHideMenuBar: true, // Versteckt Menüleiste (Datei, Ansicht, etc.)
    frame: true, // Behält Windows-Titelleiste
    titleBarStyle: 'default', // Standard Windows Design
    
    // 🖼️ ICON UND TASKBAR
    icon: path.join(__dirname, '../assets/logo.png'),
    
    // ⚙️ FENSTER-VERHALTEN
    skipTaskbar: false, // In Taskbar anzeigen
    minimizable: true,
    maximizable: true,
    closable: true,
    resizable: true,
    center: true, // Zentriert beim Start
    
    // 🎨 ERWEITERTE DESIGN-OPTIONEN
    backgroundColor: '#f8fafc', // Hintergrundfarbe beim Laden
    darkTheme: false, // Helles Theme
    thickFrame: false, // Dünner Rahmen
    
    // 📱 RESPONSIVE
    webPreferences: {
      ...{
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: false,
        allowRunningInsecureContent: false,
        backgroundThrottling: false,
        experimentalFeatures: false
      },
      zoomFactor: 1.0 // Standard Zoom
    }
  });

  // Lade die App
  let startUrl;
  
  if (isDev) {
    startUrl = 'http://localhost:5173';
  } else {
    // Verwende einfache file:// URL für Production
    const indexPath = path.join(__dirname, '../dist/index.html');
    startUrl = indexPath.replace(/\\/g, '/').replace(/^([A-Z]):/, 'file:///$1:');
  }
  
  console.log(`Loading app from: ${startUrl}`);
  
  mainWindow.loadURL(startUrl);

  // Zeige das Fenster wenn es fertig geladen ist
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window is ready and shown');
    
    // 🎨 TASKBAR CUSTOMIZATION
    // Setze App-Details für Windows Taskbar
    if (process.platform === 'win32') {
      mainWindow.setTitle('InventoryPro Analytics - Advanced KPI Suite');
      
      // Taskbar Progress (optional - für Updates/Loading)
      // mainWindow.setProgressBar(0.5); // 50% Progress bar
      
      // Taskbar Badge (optional - für Notifications)
      // mainWindow.setBadgeCount(3); // Zeigt "3" auf dem Icon
      
      // App User Model ID für Windows
      app.setAppUserModelId('com.inventorypro.analytics');
    }
    
    // Öffne DevTools nur im Development-Modus
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Console logs from renderer process
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer:', message);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Erstelle das Anwendungsmenü
function createMenu() {
  const template = [
    {
      label: 'InventoryPro Analytics',
      submenu: [
        {
          label: 'Über InventoryPro Analytics',
          click() {
            // Dialog später hinzufügen
          }
        },
        { type: 'separator' },
        {
          label: 'Beenden',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ansicht',
      submenu: [
        { role: 'reload', label: 'Neu laden' },
        { role: 'forceReload', label: 'Erzwinge Neuladen' },
        { role: 'toggleDevTools', label: 'Entwicklertools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom zurücksetzen' },
        { role: 'zoomIn', label: 'Vergrößern' },
        { role: 'zoomOut', label: 'Verkleinern' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App-Events
app.whenReady().then(async () => {
  // Deaktiviere GPU-Cache um Berechtigungsprobleme zu vermeiden
  app.commandLine.appendSwitch('--disable-gpu-sandbox');
  app.commandLine.appendSwitch('--no-sandbox');
  app.commandLine.appendSwitch('--disable-dev-shm-usage');
  app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
  
  // Setze ein temporäres Cache-Verzeichnis
  const os = require('os');
  const tempDir = path.join(os.tmpdir(), 'inventorypro-cache');
  app.setPath('userData', tempDir);
  
  await initializeDatabase();
  setupDatabaseIPC();
  createWindow();
  
  // ✅ MENÜ KOMPLETT ENTFERNT - keine Menüleiste mehr
  Menu.setApplicationMenu(null);
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => {
  if (dbInstance) {
    await dbInstance.disconnect();
  }
});

// Erstelle das Anwendungsmenü
function createMenu() {
  const template = [
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Beenden',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ansicht',
      submenu: [
        { role: 'reload', label: 'Neu laden' },
        { role: 'forceReload', label: 'Vollständig neu laden' },
        { role: 'toggleDevTools', label: 'Entwicklertools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom zurücksetzen' },
        { role: 'zoomIn', label: 'Vergrößern' },
        { role: 'zoomOut', label: 'Verkleinern' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Vollbild' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App-Event-Listener
app.whenReady().then(() => {
  createWindow();
  createMenu();

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

// Verhindere die Erstellung mehrerer Instanzen
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Jemand hat versucht, eine zweite Instanz zu starten
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
