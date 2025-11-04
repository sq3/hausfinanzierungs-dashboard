/**
 * Berechnet die monatliche Rate und Tilgungsplan für ein Darlehen
 * @param {number} principal - Darlehenssumme
 * @param {number} annualRate - Jährlicher Zinssatz in Prozent
 * @param {number} tilgungRate - Jährliche Tilgung in Prozent
 * @param {number} sondertilgungRate - Jährliche Sondertilgung in Prozent
 * @param {number} laufzeitJahre - Laufzeit in Jahren (optional, wenn nicht angegeben bis zur vollständigen Tilgung)
 * @returns {Object} Berechnungsergebnis
 */
export function calculateLoan(
  principal,
  annualRate,
  tilgungRate,
  sondertilgungRate = 0,
  laufzeitJahre = null
) {
  const termMonths =
    laufzeitJahre && laufzeitJahre > 0 ? Math.max(1, Math.round(laufzeitJahre * 12)) : null;
  const hasPlannedTerm = termMonths !== null;

  if (!principal || principal <= 0) {
    return {
      schedule: [],
      totalMonths: 0,
      totalInterest: 0,
      totalAmount: 0,
      remainingPrincipal: 0,
      principalPaid: 0,
      termMonths: termMonths ?? 0,
      hasPlannedTerm
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const monthlyTilgungRate = tilgungRate / 12 / 100;
  const monthlySondertilgungRate = sondertilgungRate / 12 / 100;

  const monthlyPayment = principal * (monthlyRate + monthlyTilgungRate);
  const monthlySonderRuecklage = principal * monthlySondertilgungRate;

  const maxMonths = termMonths ?? 600; // Sicherheitsgrenze 50 Jahre

  let restschuld = principal;
  const schedule = [];
  let month = 0;
  let totalInterest = 0;
  let totalPrincipalPaid = 0;
  let sonderReserve = 0;

  while (restschuld > 0.01 && month < maxMonths) {
    const zinsen = restschuld * monthlyRate;

    const vorgeseheneTilgung = Math.max(0, monthlyPayment - zinsen);
    let tilgung = Math.min(restschuld, vorgeseheneTilgung);

    const ruecklageBeitrag = monthlySonderRuecklage > 0 ? monthlySonderRuecklage : 0;
    sonderReserve += ruecklageBeitrag;

    let sondertilgung = 0;
    const isYearEnd = (month + 1) % 12 === 0;
    const isFinalPlannedMonth = termMonths ? month + 1 === termMonths : false;

    const sondertilgungMoeglich = restschuld - tilgung > 0 && sonderReserve > 0;
    if ((isYearEnd || isFinalPlannedMonth) && sondertilgungMoeglich) {
      sondertilgung = Math.min(restschuld - tilgung, sonderReserve);
      sonderReserve = Math.max(0, sonderReserve - sondertilgung);
    }

    const gesamtrate = zinsen + tilgung + ruecklageBeitrag;
    restschuld = restschuld - tilgung - sondertilgung;
    if (restschuld < 0.00001) restschuld = 0;

    schedule.push({
      month: month + 1,
      zinsen,
      tilgung,
      sondertilgung,
      sonderRuecklage: ruecklageBeitrag,
      gesamtrate,
      restschuld
    });

    totalInterest += zinsen;
    totalPrincipalPaid += tilgung + sondertilgung;

    month++;

    // Verhindere Endlosschleifen bei reinen Zinszahlungen
    if (!termMonths && tilgung === 0 && sondertilgung === 0 && ruecklageBeitrag === 0) {
      break;
    }
  }

  const remainingPrincipal = restschuld;
  const totalAmount = totalInterest + totalPrincipalPaid;

  return {
    schedule,
    totalMonths: schedule.length,
    totalInterest,
    totalAmount,
    remainingPrincipal,
    principalPaid: totalPrincipalPaid,
    termMonths: termMonths ?? schedule.length,
    hasPlannedTerm,
    monthlySonderRuecklage: monthlySonderRuecklage
  };
}

/**
 * Berechnet die Finanzierung mit Haupt- und KfW-Darlehen
 * @param {Object} params - Parameter für die Berechnung
 * @returns {Object} Kombiniertes Berechnungsergebnis
 */
export function calculateFinancing(params) {
  const {
    hauptdarlehen,
    hauptZinssatz,
    tilgungRate,
    sondertilgungRate,
    hauptLaufzeitJahre,
    includeKfw = true,
    kfwDarlehen = 100000,
    kfwZinssatz,
    kfwLaufzeitJahre = 10
  } = params;

  const kfwPrincipal = includeKfw ? Math.max(0, kfwDarlehen) : 0;
  const sanitizedKfwRate = Number.isFinite(kfwZinssatz) ? Math.max(0, kfwZinssatz) : 0;
  const kfwEnabled = includeKfw && kfwPrincipal > 0;

  // Berechne Hauptdarlehen (ohne KfW-Anteil)
  const hauptdarlehenBetrag = Math.max(0, hauptdarlehen - (kfwEnabled ? kfwPrincipal : 0));
  const hauptLaufzeit = hauptLaufzeitJahre ? Math.max(1, hauptLaufzeitJahre) : null;
  const hauptResult = calculateLoan(
    hauptdarlehenBetrag,
    hauptZinssatz,
    tilgungRate,
    sondertilgungRate,
    hauptLaufzeit
  );

  // Berechne KfW-Darlehen
  let kfwResult = {
    schedule: [],
    totalMonths: 0,
    totalInterest: 0,
    totalAmount: 0,
    remainingPrincipal: 0,
    principalPaid: 0,
    termMonths: 0,
    hasPlannedTerm: false,
    monthlySonderRuecklage: 0
  };

  if (kfwEnabled) {
    const effektiveKfwLaufzeit = Math.min(10, Math.max(1, kfwLaufzeitJahre || 10));
    kfwResult = calculateLoan(kfwPrincipal, sanitizedKfwRate, 2, 0, effektiveKfwLaufzeit);
  }

  // Kombiniere die monatlichen Zeitpläne
  const maxLength = Math.max(hauptResult.schedule.length, kfwResult.schedule.length);
  const combinedSchedule = [];
  const kfwScheduleLength = kfwResult.schedule.length;
  const kfwFinalRest =
    kfwScheduleLength > 0
      ? kfwResult.schedule[kfwScheduleLength - 1].restschuld
      : kfwResult.remainingPrincipal;
  let kfwOutstanding = kfwFinalRest;

  for (let i = 0; i < maxLength; i++) {
    const hauptMonth = hauptResult.schedule[i] || {
      zinsen: 0,
      tilgung: 0,
      sondertilgung: 0,
      sonderRuecklage: 0,
      gesamtrate: 0,
      restschuld: 0
    };

    let kfwMonth;
    if (i < kfwScheduleLength) {
      kfwMonth = kfwResult.schedule[i];
      kfwOutstanding = kfwMonth.restschuld;
    } else {
      kfwMonth = {
        zinsen: 0,
        tilgung: 0,
        sondertilgung: 0,
        sonderRuecklage: 0,
        gesamtrate: 0,
        restschuld: kfwOutstanding
      };
    }

    combinedSchedule.push({
      month: i + 1,
      hauptZinsen: hauptMonth.zinsen,
      hauptTilgung: hauptMonth.tilgung,
      hauptSondertilgung: hauptMonth.sondertilgung,
      hauptRuecklage: hauptMonth.sonderRuecklage,
      hauptRestschuld: hauptMonth.restschuld,
      kfwZinsen: kfwMonth.zinsen,
      kfwTilgung: kfwMonth.tilgung,
      kfwSondertilgung: kfwMonth.sondertilgung,
      kfwRuecklage: kfwMonth.sonderRuecklage,
      kfwRestschuld: kfwMonth.restschuld,
      gesamtZinsen: hauptMonth.zinsen + kfwMonth.zinsen,
      gesamtTilgung: hauptMonth.tilgung + kfwMonth.tilgung,
      gesamtSondertilgung: hauptMonth.sondertilgung + kfwMonth.sondertilgung,
      gesamtRuecklage: hauptMonth.sonderRuecklage + kfwMonth.sonderRuecklage,
      gesamtRate: hauptMonth.gesamtrate + kfwMonth.gesamtrate,
      gesamtRestschuld: hauptMonth.restschuld + kfwMonth.restschuld
    });
  }

  return {
    combinedSchedule,
    hauptdarlehen: {
      betrag: hauptdarlehenBetrag,
      totalInterest: hauptResult.totalInterest,
      totalMonths: hauptResult.totalMonths,
      plannedMonths: hauptResult.termMonths,
      remainingPrincipal: hauptResult.remainingPrincipal,
      principalPaid: hauptResult.principalPaid,
      hasPlannedTerm: hauptResult.hasPlannedTerm,
      monthlySonderRuecklage: hauptResult.monthlySonderRuecklage
    },
    kfwDarlehen: {
      enabled: kfwEnabled,
      betrag: kfwPrincipal,
      zinssatz: sanitizedKfwRate,
      totalInterest: kfwResult.totalInterest,
      totalMonths: kfwResult.totalMonths,
      plannedMonths: kfwResult.termMonths,
      remainingPrincipal: kfwResult.remainingPrincipal,
      principalPaid: kfwResult.principalPaid,
      hasPlannedTerm: kfwResult.hasPlannedTerm,
      monthlySonderRuecklage: kfwResult.monthlySonderRuecklage,
      transferMonth: kfwResult.termMonths,
      transferAmount: kfwResult.remainingPrincipal
    },
    gesamt: {
      darlehen: hauptdarlehen,
      totalInterest: hauptResult.totalInterest + kfwResult.totalInterest,
      totalAmount: hauptResult.totalAmount + kfwResult.totalAmount,
      principalPaid: hauptResult.principalPaid + kfwResult.principalPaid,
      totalMonths: maxLength,
      remainingPrincipal:
        hauptResult.remainingPrincipal + (kfwEnabled ? kfwResult.remainingPrincipal : 0),
      remainingPrincipalMainLoan: hauptResult.remainingPrincipal,
      remainingPrincipalKfw: kfwEnabled ? kfwResult.remainingPrincipal : 0,
      monthlySonderRuecklage:
        (hauptResult.monthlySonderRuecklage || 0) + (kfwResult.monthlySonderRuecklage || 0)
    }
  };
}
