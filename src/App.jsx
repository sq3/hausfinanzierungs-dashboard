import { useState, useEffect } from 'react';
import FinanceForm from './components/FinanceForm';
import FinanceSummary from './components/FinanceSummary';
import FinanceChart from './components/FinanceChart';
import { calculateFinancing } from './utils/financeCalculator';

const STORAGE_KEY = 'hausfinanzierung-data';

function App() {
  const [formValues, setFormValues] = useState(null);
  const [result, setResult] = useState(null);

  // Lade gespeicherte Daten beim Start
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormValues(parsed.formValues);
        setResult(parsed.result);
      } catch (error) {
        console.error('Fehler beim Laden der gespeicherten Daten:', error);
      }
    }
  }, []);

  // Speichere Daten bei Änderungen
  useEffect(() => {
    if (formValues && result) {
      const dataToSave = {
        formValues,
        result,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formValues, result]);

  const handleCalculate = (data) => {
    setFormValues(data);
    const calculationResult = calculateFinancing(data);
    setResult(calculationResult);
  };

  const handleReset = () => {
    if (window.confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
      localStorage.removeItem(STORAGE_KEY);
      setFormValues(null);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hausfinanzierungs-Dashboard
          </h1>
          <p className="text-gray-600">
            Berechnen und visualisieren Sie Ihre Immobilienfinanzierung
          </p>
        </div>

        {/* Form */}
        <div className="mb-8">
          <FinanceForm onCalculate={handleCalculate} initialValues={formValues} />
        </div>

        {/* Reset Button */}
        {result && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              Daten zurücksetzen
            </button>
          </div>
        )}

        {/* Summary */}
        {result && <FinanceSummary result={result} />}

        {/* Charts */}
        {result && <FinanceChart data={result.combinedSchedule} />}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Alle Berechnungen sind Richtwerte. Für eine verbindliche Auskunft konsultieren Sie bitte einen Finanzberater.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
