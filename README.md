# Hausfinanzierungs-Dashboard

Eine React-Anwendung (Vite + Tailwind CSS) zur Simulation und Visualisierung komplexer Immobilien­finanzierungen mit getrennten Haupt- und KfW-Darlehen. Alle Texte der Oberfläche sind auf Deutsch, die README bleibt ebenfalls überwiegend deutschsprachig.

## Highlights
- **Umfassende Eingabe**: Annuitätendarlehen mit Zinssatz, Tilgung, Sondertilgung und optionalem KfW-Anteil (inkl. Laufzeitbegrenzung auf 10 Jahre).
- **Übersicht & Analyse**: Karten mit Kennzahlen (Zinsen, Restschuld, Gesamtkosten, Sondertilgungs-Rücklage) sowie ein monatlich aufgelöster Tilgungsplan.
- **Visualisierung**: Recharts-Diagramme zeigen Zins-/Tilgungsverlauf und Restschuldentwicklung.
- **Persistente Daten**: Alle Eingaben werden unter dem LocalStorage-Key `hausfinanzierung-data` gespeichert und lassen sich gezielt zurücksetzen.
- **Responsive UI**: Tailwind CSS sorgt dafür, dass Formular, Auswertung und Charts auf Desktop und Mobilgeräten funktionieren.
- **Status der KfW-Berechnung**: Der KfW-Zweig befindet sich noch im Aufbau; Ergebnisse gelten vorerst als experimentell.

## Technologie-Stack
- React 19 + React DOM 19
- Vite 7
- Tailwind CSS 3
- Recharts 3
- ESLint 9 (konfiguriert für React Hooks & React Refresh)

## Voraussetzungen
- Node.js ≥ 18 (Empfehlung: LTS-Version)
- npm ≥ 9

## Lokale Entwicklung
```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver mit Hot Module Reloading starten
npm run dev

# Produktionsbuild erzeugen
npm run build

# Gebauten Stand lokal testen
npm run preview

# Optional: statische Codeanalyse
npm run lint
```

Der Dev-Server läuft standardmäßig auf `http://localhost:5173`.

## Projektstruktur
```text
src/
├── App.jsx                   # Hauptcontainer inkl. Laden/Speichern der Formulardaten
├── assets/                   # Statische Assets (z. B. Logos)
├── components/
│   ├── FinanceForm.jsx       # Formular und Input-Komponenten für Haupt-/KfW-Daten
│   ├── FinanceSummary.jsx    # Kennzahl-Übersicht inkl. Formatierung in EUR
│   └── FinanceChart.jsx      # Recharts-Auswertungen zu Zinsen/Tilgung/Restschuld
├── utils/
│   └── financeCalculator.js  # Fachliche Berechnungslogik inkl. Sondertilgungen
├── index.css                 # Tailwind Entry + Grundlayout
└── main.jsx                  # React-Einstiegspunkt (StrictMode)
```

## Berechnungslogik in Kürze
- `calculateLoan` erzeugt einen monatlichen Tilgungsplan nach Annuitäten-Logik, berücksichtigt optionale Sondertilgungen (jährlich bzw. am Laufzeitende) und liefert Kennzahlen wie Restschuld, gezahlte Zinsen sowie die benötigte Sondertilgungs-Rücklage.
- `calculateFinancing` kombiniert Haupt- und KfW-Darlehen: KfW-Raten werden automatisch vom Hauptdarlehen separiert, Laufzeiten werden synchronisiert, und der kombinierte Plan dient als Grundlage für Diagramme und Kennzahlen. Hinweis: Der KfW-Pfad wird aktuell überarbeitet; Rückmeldungen zu Abweichungen sind willkommen.
- Die KfW-Laufzeit ist auf maximal 10 Jahre begrenzt; Restschulden nach Ablauf werden separat ausgewiesen.

## Datenpersistenz & Reset
- Die Anwendung speichert Formular- und Ergebnisdaten automatisch im Browser (`localStorage`).
- Über den Button „Daten zurücksetzen“ lässt sich der Speicher leeren und die App in den Ausgangszustand versetzen.

## Deployment-Hinweise
Der Build erzeugt ein statisches Bundle im Verzeichnis `dist/`. Das Projekt eignet sich für Hosting-Anbieter wie Vercel, Netlify oder GitHub Pages. Für GitHub Pages muss in `vite.config.js` eine `base`-URL gesetzt werden, falls das Repository nicht auf der Root-Domain liegt.

## Haftungsausschluss
Alle Ergebnisse sind Richtwerte und ersetzen keine persönliche Beratung. Für verbindliche Angebote wenden Sie sich an Ihre Bank oder eine qualifizierte Finanzberaterin / einen qualifizierten Finanzberater.

## Lizenz
Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). Kommerzielle Nutzung und Verbreitung sind untersagt; private, akademische oder interne Nutzung sowie Modifikationen sind erlaubt, sofern die ursprüngliche Quelle genannt wird.
