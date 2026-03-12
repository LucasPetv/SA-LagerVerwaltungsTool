const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für den Renderer-Prozess
contextBridge.exposeInMainWorld('electronAPI', {
  // Datenbankoperationen
  database: {
    connect: (config) => ipcRenderer.invoke('db-connect', config),
    disconnect: () => ipcRenderer.invoke('db-disconnect'),
    authenticateUser: (username, password, ipAddress, userAgent) => 
      ipcRenderer.invoke('db-auth-user', username, password, ipAddress, userAgent),
    getAllUsers: () => ipcRenderer.invoke('db-get-users'),
    getLoginHistory: (limit) => ipcRenderer.invoke('db-get-login-history', limit)
  }
});

console.log('✅ Preload script loaded - electronAPI available');
