import React, { useState } from 'react';
import { ColumnMapping, InventoryRow } from '../types';
import { InventoryService } from '../services/inventoryService';
import { 
  Settings, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download,
  LayoutGrid,
  Database,
  TestTube
} from 'lucide-react';

interface SettingsViewProps {
  mapping?: ColumnMapping;
  setMapping?: (mapping: ColumnMapping) => void;
  columnMapping?: ColumnMapping;
  onColumnMappingChange?: (mapping: ColumnMapping) => void;
  onTestData?: (testData: InventoryRow[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  mapping,
  setMapping,
  columnMapping,
  onColumnMappingChange,
  onTestData
}) => {
  // Use whichever props are provided
  const currentMapping = mapping || columnMapping || {
    Artikel: 'Artikel',
    Istbestand: 'Istbestand',
    Inventurergebnis: 'Inventurergebnis',
    Preis: 'Preis',
    Verbrauch: 'Verbrauch',
    Jahr: 'Jahr'
  };

  const updateMapping = setMapping || onColumnMappingChange || (() => {});

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (field: keyof ColumnMapping, value: string) => {
    updateMapping({ ...currentMapping, [field]: value });
    setSaveStatus('idle');
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setStatusMessage('');

    try {
      // Simulate server save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setStatusMessage('Spalten-Mapping erfolgreich gespeichert!');
      console.log('✅ Settings saved:', currentMapping);
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage('Fehler beim Speichern der Einstellungen.');
      console.error('❌ Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadTestData = () => {
    if (onTestData) {
      const testData: InventoryRow[] = [
        {
          Artikel: 'Test-Produkt A',
          Istbestand: 100,
          Inventurergebnis: 95,
          Preis: 25.50,
          Verbrauch: 150,
          Jahr: 2024
        },
        {
          Artikel: 'Test-Produkt B', 
          Istbestand: 200,
          Inventurergebnis: 180,
          Preis: 15.75,
          Verbrauch: 300,
          Jahr: 2024
        },
        {
          Artikel: 'Test-Produkt C',
          Istbestand: 50,
          Inventurergebnis: 48,
          Preis: 45.00,
          Verbrauch: 75,
          Jahr: 2024
        }
      ];
      
      onTestData(testData);
      console.log('✅ Test data loaded:', testData.length, 'items');
    }
  };

  const mappingFields: Array<{key: keyof ColumnMapping, label: string}> = [
    { key: 'Artikel', label: 'Artikel/Produktname' },
    { key: 'Ist-Bestand', label: 'Istbestand' },
    { key: 'Inventurergebnis', label: 'Inventurergebnis' },
    { key: 'Preis', label: 'Preis' },
    { key: 'Verbrauch', label: 'Verbrauch' },
    { key: 'Jahr', label: 'Jahr' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Einstellungen</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Konfigurieren Sie die Spalten-Zuordnung für den CSV-Import und testen Sie die Anwendung mit Beispieldaten.
        </p>
      </div>

      {/* Column Mapping Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <LayoutGrid className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Spalten-Zuordnung</h2>
        </div>

        <div className="grid gap-4">
          {mappingFields.map((field) => (
            <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={currentMapping[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`CSV-Spaltenname für ${field.label}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Speichert...' : 'Einstellungen speichern'}
          </button>
        </div>

        {/* Status Message */}
        {saveStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            saveStatus === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium text-sm">
                {saveStatus === 'success' ? 'Erfolgreich!' : 'Fehler'}
              </p>
              <p className="text-sm">{statusMessage}</p>
            </div>
          </div>
        )}
      </div>

    

      {/* Environment Info */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900">System-Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Environment:</span>
            <span className="font-medium">{process.env.NODE_ENV || 'development'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Platform:</span>
            <span className="font-medium">
              {typeof window !== 'undefined' && (window as any).electronAPI ? 'Electron' : 'Browser'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">React Version:</span>
            <span className="font-medium">{React.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Timestamp:</span>
            <span className="font-medium">{new Date().toLocaleString('de-DE')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
