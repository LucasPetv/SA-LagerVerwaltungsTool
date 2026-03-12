import React from 'react';

const SimpleApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Inter, Arial, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        🚀 InventoryPro Analytics
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        System erfolgreich gestartet!
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>📊 System Status</h2>
        <div style={{ display: 'grid', gap: '15px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Environment:</strong></span>
            <span>{process.env.NODE_ENV || 'development'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Electron API:</strong></span>
            <span>{typeof window !== 'undefined' && (window as any).electronAPI ? '✅ Verfügbar' : '❌ Browser'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>React:</strong></span>
            <span>✅ {React.version}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '0.9rem', opacity: 0.8 }}>
        <p>Alle Systeme funktionsfähig. Die vollständige App kann geladen werden.</p>
      </div>
    </div>
  );
};

export default SimpleApp;
