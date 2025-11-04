export default function FinanceSummary({ result }) {
  if (!result) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatMonths = (months) => {
    if (months === null || months === undefined) {
      return '–';
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} Jahre ${remainingMonths} Monate`;
  };

  const formatPlannedTerm = (section) => {
    if (!section) {
      return '–';
    }
    return section.hasPlannedTerm
      ? formatMonths(section.plannedMonths)
      : 'Bis zur vollständigen Tilgung';
  };

  const SummaryCard = ({ title, items, bgColor = "bg-gray-50" }) => (
    <div className={`${bgColor} rounded-lg p-4 shadow`}>
      <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
      {items.map((item, index) => (
        <div key={index} className="flex justify-between py-1">
          <span className="text-sm text-gray-600">{item.label}:</span>
          <span className="text-sm font-medium text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Finanzierungsübersicht</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hauptdarlehen */}
        <SummaryCard
          title="Hauptdarlehen"
          bgColor="bg-blue-50"
          items={[
            { label: 'Darlehensbetrag', value: formatCurrency(result.hauptdarlehen.betrag) },
            { label: 'Gesamtzinsen', value: formatCurrency(result.hauptdarlehen.totalInterest) },
            { label: 'Laufzeit (geplant)', value: formatPlannedTerm(result.hauptdarlehen) },
            { label: 'Simulierte Laufzeit', value: formatMonths(result.hauptdarlehen.totalMonths) },
            { label: 'Monatliche Sondertilgungs-Rücklage', value: formatCurrency(result.hauptdarlehen.monthlySonderRuecklage || 0) },
            { label: 'Restschuld nach Laufzeit', value: formatCurrency(result.hauptdarlehen.remainingPrincipal) }
          ]}
        />

        {/* KfW Darlehen */}
        <SummaryCard
          title="KfW-Darlehen"
          bgColor="bg-green-50"
          items={[
            { label: 'Darlehensbetrag', value: formatCurrency(result.kfwDarlehen.betrag) },
            { label: 'Gesamtzinsen', value: formatCurrency(result.kfwDarlehen.totalInterest) },
            { label: 'Laufzeit (geplant)', value: formatPlannedTerm(result.kfwDarlehen) },
            { label: 'Simulierte Laufzeit', value: formatMonths(result.kfwDarlehen.totalMonths) },
            { label: 'Monatliche Sondertilgungs-Rücklage', value: formatCurrency(result.kfwDarlehen.monthlySonderRuecklage || 0) },
            { label: 'Restschuld nach Laufzeit', value: formatCurrency(result.kfwDarlehen.remainingPrincipal) }
          ]}
        />

        {/* Gesamt */}
        <SummaryCard
          title="Gesamtfinanzierung"
          bgColor="bg-purple-50"
          items={[
            { label: 'Gesamtdarlehen', value: formatCurrency(result.gesamt.darlehen) },
            { label: 'Gesamtzinsen', value: formatCurrency(result.gesamt.totalInterest) },
            { label: 'Tilgungssumme', value: formatCurrency(result.gesamt.principalPaid) },
            { label: 'Gesamtkosten (gezahlt)', value: formatCurrency(result.gesamt.totalAmount) },
            { label: 'Längste simulierte Laufzeit', value: formatMonths(result.gesamt.totalMonths) },
            { label: 'Monatliche Sondertilgungs-Rücklage', value: formatCurrency(result.gesamt.monthlySonderRuecklage || 0) },
            { label: 'Restschuld nach Laufzeit', value: formatCurrency(result.gesamt.remainingPrincipal) }
          ]}
        />
      </div>

      {/* Monatliche Rate */}
      <div className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Monatliche Rate (Anfang):</span>
          <span className="text-2xl font-bold">
            {formatCurrency(result.combinedSchedule[0]?.gesamtRate || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
