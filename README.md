# Hausfinanzierungs-Dashboard

Eine moderne Web-Anwendung zur Berechnung und Visualisierung von Immobilienfinanzierungen mit separater Haupt- und KfW-Darlehensberechnung.

## Features

- **Interaktive Eingabe**: Einfache Formulareingabe für alle relevanten Finanzierungsparameter
- **Duale Darlehensberechnung**: Separate Berechnung für Hauptdarlehen und KfW-Förderung
- **Visualisierung**: Interaktive Diagramme für Zinsen, Tilgung und Restschuldverlauf
- **Datenpersistierung**: Automatisches Speichern aller Eingaben im Browser (LocalStorage)
- **Responsive Design**: Optimiert für Desktop und mobile Geräte
- **Monatsgenaue Berechnung**: Detaillierter Tilgungsplan auf Monatsbasis

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build

# Preview des Production Builds
npm run preview
```

## Verwendung

1. Öffne die App im Browser (standardmäßig auf `http://localhost:5173`)
2. Gib die Parameter für deine Finanzierung ein:
   - **Hauptdarlehen**: Darlehenssumme, Zinssatz, Tilgung, Sondertilgung
   - **KfW-Darlehen**: Darlehenssumme (default 100.000€), Zinssatz, Laufzeit
3. Klicke auf "Berechnen"
4. Betrachte die Zusammenfassung und Visualisierungen
5. Alle Daten werden automatisch gespeichert und beim nächsten Besuch wiederhergestellt

## Deployment

### Vercel (Empfohlen)

1. Repository auf GitHub pushen
2. Gehe zu [vercel.com](https://vercel.com) und verbinde dein GitHub-Repository
3. Vercel erkennt automatisch das Vite-Projekt
4. Klicke auf "Deploy"

**Oder via CLI:**

```bash
npm install -g vercel
vercel
```

### Netlify

1. Repository auf GitHub pushen
2. Gehe zu [netlify.com](https://netlify.com)
3. "New site from Git" auswählen
4. Repository verbinden
5. Build-Einstellungen:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy starten

**Oder via CLI:**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# Installiere gh-pages
npm install --save-dev gh-pages

# In package.json die homepage hinzufügen:
# "homepage": "https://<username>.github.io/<repo-name>"

# Deploy Script in package.json hinzufügen:
# "deploy": "npm run build && gh-pages -d dist"

# Deployen
npm run deploy
```

**Wichtig für GitHub Pages:** Füge in `vite.config.js` die `base` Option hinzu:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/<repo-name>/'
})
```

## Technologie-Stack

- **React 18**: UI Framework
- **Vite**: Build Tool und Development Server
- **Recharts**: Datenvisualisierung
- **Tailwind CSS**: Styling
- **LocalStorage API**: Datenpersistierung

## Projektstruktur

```
src/
├── components/
│   ├── FinanceForm.jsx      # Eingabeformular
│   ├── FinanceSummary.jsx   # Übersicht der Ergebnisse
│   └── FinanceChart.jsx     # Diagramme
├── utils/
│   └── financeCalculator.js # Berechnungslogik
├── App.jsx                  # Hauptkomponente
├── main.jsx                # Entry Point
└── index.css               # Globale Styles

## Berechnungslogik

Die App berechnet:

1. **Monatliche Raten**: Zinsen, Tilgung und Sondertilgung
2. **Restschuldverlauf**: Monatsgenaue Entwicklung der Restschuld
3. **Gesamtkosten**: Summe aller Zinszahlungen über die Laufzeit
4. **Separate Berechnung**: Unterschiedliche Zinssätze und Laufzeiten für Haupt- und KfW-Darlehen

Die Formeln basieren auf dem Annuitätendarlehen-Modell mit Sondertilgungsoption.

## Hinweis

Diese Anwendung dient nur zu Informationszwecken. Für eine verbindliche Finanzierungsberatung konsultieren Sie bitte einen qualifizierten Finanzberater oder Ihre Bank.

## Lizenz

MIT
```
