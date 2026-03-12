import React, { useState } from 'react';
import { User, Lock, LayoutDashboard, FileUp, BarChart3, Settings, BookOpen, LogOut, Database, Shield, Activity, Package, TrendingUp, DollarSign } from 'lucide-react';

const MinimalApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Demo login handler
  const handleLogin = () => {
    if ((username === 'demo' && password === 'demo123') || (username === 'admin' && password === 'admin123')) {
      setIsLoggedIn(true);
    } else {
      alert('❌ Ungültige Anmeldedaten!\n\nDemo-Logins:\n• demo / demo123\n• admin / admin123');
    }
  };

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-input', label: 'Datenimport', icon: FileUp },
    { id: 'analytics', label: 'Analysetabelle', icon: BarChart3 },
    { id: 'database', label: 'Datenverwaltung', icon: Database },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
    { id: 'manual', label: 'Benutzerhandbuch', icon: BookOpen },
  ];

  // Mock KPI data
  const mockKPIs = [
    { title: 'Gesamtartikel', value: '2,458', icon: Package, color: 'blue' },
    { title: 'Gesamtwert', value: '€ 1,234,567', icon: DollarSign, color: 'green' },
    { title: 'Umschlag/Jahr', value: '4.2x', icon: TrendingUp, color: 'purple' },
    { title: 'Aktive Artikel', value: '1,892', icon: Activity, color: 'orange' },
  ];

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <Package size={40} color="white" />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            InventoryPro Analytics
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
            Professional Inventory Management
          </p>

          {/* Login Form */}
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Benutzername
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  placeholder="demo oder admin"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Passwort
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  placeholder="demo123 oder admin123"
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.1s',
                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.3)'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Anmelden
            </button>
          </div>

          {/* Demo Info */}
          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            color: '#92400e'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>🔒 Demo-Modus</div>
            <div>demo/demo123 oder admin/admin123</div>
          </div>
        </div>
      </div>
    );
  }

  // Main Application UI
  return (
    <div style={{ height: '100vh', display: 'flex', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        {/* Logo Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <Package size={24} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>InventoryPro</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Analytics v1.0.1</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <User size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{username}</div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <Shield size={12} style={{ marginRight: '4px' }} />
                Demo-Modus
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  marginBottom: '4px',
                  background: isActive ? '#667eea' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.color = '#334155';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                <Icon size={18} style={{ marginRight: '12px' }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setUsername('');
              setPassword('');
              setCurrentView('dashboard');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'transparent',
              color: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <LogOut size={18} style={{ marginRight: '12px' }} />
            Abmelden
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                {navItems.find(item => item.id === currentView)?.label || 'Dashboard'}
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>
                Professional Inventory Analytics & Management • Version 1.0.1
              </p>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              📦 Demo-Daten geladen
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {currentView === 'dashboard' && (
            <div>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {mockKPIs.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={index} style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#64748b', margin: 0 }}>{kpi.title}</h3>
                        <Icon size={20} color={`var(--${kpi.color}-500, #6366f1)`} />
                      </div>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{kpi.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Feature Info */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
                  🎉 InventoryPro Analytics erfolgreich gestartet!
                </h2>
                <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
                  Die vollständige feature-basierte Architektur ist implementiert und die App läuft sowohl im Browser als auch in Electron.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                      ✅ Funktioniert:
                    </h3>
                    <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                      <li>React 19.2.4 + TypeScript</li>
                      <li>Feature-basierte Architektur</li>
                      <li>Electron Desktop Integration</li>
                      <li>Demo Authentication System</li>
                      <li>Responsive Modern UI</li>
                      <li>Production-Ready Build</li>
                    </ul>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                      🚀 Nächste Schritte:
                    </h3>
                    <ul style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                      <li>Excel-Import implementieren</li>
                      <li>ABC-Analyse Algorithmus</li>
                      <li>Chart-Visualisierungen</li>
                      <li>Erweiterte KPI-Berechnung</li>
                      <li>Database-Integration</li>
                      <li>Export-Funktionen</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView !== 'dashboard' && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                background: '#f8fafc',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Settings size={32} color="#64748b" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
                Feature in Entwicklung
              </h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Das {navItems.find(item => item.id === currentView)?.label} Feature wird in der nächsten Version implementiert.
              </p>
              <button
                onClick={() => setCurrentView('dashboard')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Zurück zum Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalApp;
