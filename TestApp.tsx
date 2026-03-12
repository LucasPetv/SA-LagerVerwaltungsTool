import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4f46e5' }}>✅ InventoryPro Analytics Test</h1>
      <p>Wenn du das siehst, funktioniert der React-Import und Rendering!</p>
      <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
        <p><strong>Electron:</strong> {typeof window !== 'undefined' && (window as any).electronAPI ? '✅ Verfügbar' : '❌ Nicht verfügbar'}</p>
      </div>
    </div>
  );
};

export default TestApp;
