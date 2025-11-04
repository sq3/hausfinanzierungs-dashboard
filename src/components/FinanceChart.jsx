import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function FinanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Keine Daten verfügbar. Bitte führen Sie eine Berechnung durch.</p>
      </div>
    );
  }

  // Formatiere Daten für den Chart (jeden 3. Monat für bessere Lesbarkeit bei langen Laufzeiten)
  const chartData = data.map(item => ({
    month: item.month,
    jahr: Math.ceil(item.month / 12),
    monat: item.month % 12 || 12,
    zinsen: Math.round(item.gesamtZinsen),
    tilgung: Math.round(item.gesamtTilgung),
    sondertilgung: Math.round(item.gesamtSondertilgung),
    restschuld: Math.round(item.gesamtRestschuld)
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold mb-2">Monat {data.month} (Jahr {data.jahr}, Monat {data.monat})</p>
          <p className="text-sm text-blue-600">Zinsen: {formatCurrency(data.zinsen)}</p>
          <p className="text-sm text-green-600">Tilgung: {formatCurrency(data.tilgung)}</p>
          {data.sondertilgung > 0 && (
            <p className="text-sm text-orange-500">Sondertilgung: {formatCurrency(data.sondertilgung)}</p>
          )}
          <p className="text-sm text-gray-700 font-medium mt-1">
            Restschuld: {formatCurrency(data.restschuld)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Zinsen und Tilgung Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Monatliche Zinsen und Tilgung
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: 'Monat', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: 'Betrag (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="linear"
              dataKey="zinsen"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              name="Zinsen"
            />
            <Area
              type="linear"
              dataKey="tilgung"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              name="Tilgung"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Restschuld Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Restschuldverlauf
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              label={{ value: 'Monat', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: 'Restschuld (€)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="stepAfter"
              dataKey="restschuld"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Restschuld"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
