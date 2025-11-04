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
            updated[key] = toInputString(value);
          }
        });
        return updated;
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedData = {
      hauptdarlehen: toNumber(formData.hauptdarlehen),
      hauptZinssatz: toNumber(formData.hauptZinssatz),
      tilgungRate: toNumber(formData.tilgungRate),
      sondertilgungRate: toNumber(formData.sondertilgungRate),
      hauptLaufzeitJahre: Math.max(0, Math.round(toNumber(formData.hauptLaufzeitJahre))),
      kfwDarlehen: toNumber(formData.kfwDarlehen),
      kfwZinssatz: toNumber(formData.kfwZinssatz),
      kfwLaufzeitJahre: Math.min(10, Math.max(0, Math.round(toNumber(formData.kfwLaufzeitJahre))))
    };
    onCalculate(normalizedData);
  };

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
          <InputField
            label="KfW-Darlehenssumme"
            name="kfwDarlehen"
            value={formData.kfwDarlehen}
            onChange={handleChange}
            step="1000"
            suffix="€"
          />
          <InputField
            label="KfW-Zinssatz"
            name="kfwZinssatz"
            value={formData.kfwZinssatz}
            onChange={handleChange}
            step="0.01"
            suffix="%"
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
  helperText
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
        {hasSuffix && (
          <span className="absolute right-3 top-2 text-gray-500 text-sm">
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
