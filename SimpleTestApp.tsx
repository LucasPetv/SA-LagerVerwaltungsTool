import React from 'react';

const SimpleTestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Test App läuft!</h1>
      <p>Wenn Sie das sehen, funktioniert React grundsätzlich.</p>
      <button 
        onClick={() => alert('Button funktioniert!')}
        style={{ padding: '10px 20px', margin: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Test Button
      </button>
    </div>
  );
};

export default SimpleTestApp;
