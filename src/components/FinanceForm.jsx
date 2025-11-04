import { useState, useEffect } from 'react';

const toInputString = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const toNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const normalized =
    typeof value === 'string' ? value.replace(',', '.').trim() : String(value);

  if (normalized === '') {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function FinanceForm({ onCalculate, initialValues }) {
  const [formData, setFormData] = useState({
    hauptdarlehen: toInputString(initialValues?.hauptdarlehen ?? 500000),
    hauptZinssatz: toInputString(initialValues?.hauptZinssatz ?? 3.5),
    tilgungRate: toInputString(initialValues?.tilgungRate ?? 2.0),
    sondertilgungRate: toInputString(initialValues?.sondertilgungRate ?? 1.0),
    hauptLaufzeitJahre: toInputString(initialValues?.hauptLaufzeitJahre ?? 15),
    includeKfw: initialValues?.includeKfw === undefined ? true : Boolean(initialValues.includeKfw),
    kfwDarlehen: toInputString(initialValues?.kfwDarlehen ?? 100000),
    kfwZinssatz: toInputString(initialValues?.kfwZinssatz ?? 1.5),
    kfwLaufzeitJahre: toInputString(initialValues?.kfwLaufzeitJahre ?? 10)
  });

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => {
        const updated = { ...prev };
        Object.entries(initialValues).forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(prev, key)) {
            if (key === 'includeKfw') {
              updated[key] = Boolean(value);
            } else {
              updated[key] = toInputString(value);
            }
          }
        });
        return updated;
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const includeKfwActive = Boolean(formData.includeKfw);
    const normalizedData = {
      includeKfw: includeKfwActive,
      hauptdarlehen: toNumber(formData.hauptdarlehen),
      hauptZinssatz: toNumber(formData.hauptZinssatz),
      tilgungRate: toNumber(formData.tilgungRate),
      sondertilgungRate: toNumber(formData.sondertilgungRate),
      hauptLaufzeitJahre: Math.max(0, Math.round(toNumber(formData.hauptLaufzeitJahre))),
      kfwDarlehen: includeKfwActive ? toNumber(formData.kfwDarlehen) : 0,
      kfwZinssatz: includeKfwActive ? toNumber(formData.kfwZinssatz) : 0,
      kfwLaufzeitJahre: Math.min(10, Math.max(0, Math.round(toNumber(formData.kfwLaufzeitJahre))))
    };
    onCalculate(normalizedData);
  };

  const includeKfw = Boolean(formData.includeKfw);
  const kfwDisabled = !includeKfw;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Finanzierungsrechner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hauptdarlehen Section */}
        <div className="border-r md:pr-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Hauptdarlehen</h3>
          <InputField
            label="Darlehenssumme"
            name="hauptdarlehen"
            value={formData.hauptdarlehen}
            onChange={handleChange}
            step="1000"
            suffix="€"
          />
          <InputField
            label="Zinssatz"
            name="hauptZinssatz"
            value={formData.hauptZinssatz}
            onChange={handleChange}
            step="0.01"
            suffix="%"
          />
          <InputField
            label="Tilgungsrate"
            name="tilgungRate"
            value={formData.tilgungRate}
            onChange={handleChange}
            step="0.1"
            suffix="%"
          />
          <InputField
            label="Sondertilgung (jährlich)"
            name="sondertilgungRate"
            value={formData.sondertilgungRate}
            onChange={handleChange}
            step="0.1"
            suffix="%"
          />
          <InputField
            label="Laufzeit Hauptdarlehen"
            name="hauptLaufzeitJahre"
            value={formData.hauptLaufzeitJahre}
            onChange={handleChange}
            type="select"
            options={[
              { label: '10 Jahre', value: '10' },
              { label: '15 Jahre', value: '15' },
              { label: '20 Jahre', value: '20' }
            ]}
          />
        </div>

        {/* KfW Darlehen Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">KfW-Darlehen</h3>
          <div className="flex items-center mb-3">
            <input
              id="includeKfw"
              type="checkbox"
              name="includeKfw"
              checked={includeKfw}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeKfw" className="ml-2 text-sm text-gray-700">
              KfW-Darlehen berücksichtigen
            </label>
          </div>
          <p className={`text-xs mb-4 ${kfwDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
            Tilgung fest: 2% p.a., keine Sondertilgung. Restschuld nach Ende der Laufzeit (max. 10 Jahre)
            wird in das Hauptdarlehen übernommen oder sofort fällig.
          </p>
          <InputField
            label="KfW-Darlehenssumme"
            name="kfwDarlehen"
            value={formData.kfwDarlehen}
            onChange={handleChange}
            step="1000"
            suffix="€"
            disabled={kfwDisabled}
          />
          <InputField
            label="KfW-Zinssatz"
            name="kfwZinssatz"
            value={formData.kfwZinssatz}
            onChange={handleChange}
            step="0.01"
            suffix="%"
            disabled={kfwDisabled}
          />
          <InputField
            label="KfW-Laufzeit"
            name="kfwLaufzeitJahre"
            value={formData.kfwLaufzeitJahre}
            onChange={handleChange}
            step="1"
            max="10"
            suffix="Jahre"
            helperText="Maximal 10 Jahre (automatisch begrenzt)."
            disabled={kfwDisabled}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
      >
        Berechnen
      </button>
    </form>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = 'number',
  step = '0.01',
  suffix = '',
  options,
  min,
  max,
  helperText,
  disabled = false
}) {
  const inputId = name;
  const hasOptions = Array.isArray(options) && options.length > 0;
  const hasSuffix = !!suffix && !hasOptions;

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {hasOptions ? (
          <select
            id={inputId}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            type={type}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            step={step}
            min={min}
            max={max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            disabled={disabled}
          />
        )}
        {hasSuffix && (
          <span
            className={`absolute right-3 top-2 text-sm ${
              disabled ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
