# CLAUDE CODE INSTRUCTIONS
# Fentanyl Corridors Dashboard — React + deck.gl + Mapbox GL JS

## PROJECT OVERVIEW

Build an interactive geospatial dashboard that visualizes fentanyl market dynamics 
across five Mexican border cities, as supplementary material to an InSight Crime 
report titled "Reglas locales, lecciones globales" (March 2026).

The dashboard has THREE panels:
1. **The Corridors** — An interactive map showing the five Mexican cities paired with 
   their U.S. counterparts, connected by arc flows, color-coded by criminal governance type
2. **The Asymmetry** — Side-by-side comparison charts for each corridor showing 
   Mexico-side vs. U.S.-side indicators
3. **The Timeline** — An animated horizontal timeline from 2013-2025 with key events 
   and overlaid time-series data

## TECH STACK

- **React 18** (Vite for bundling)
- **deck.gl** (ArcLayer for corridor flows, ScatterplotLayer for cities, TextLayer for labels)
- **react-map-gl** (Mapbox GL JS wrapper for React)
- **Mapbox GL JS** with a dark basemap style
- **Recharts** for the charts in Panel 2 and Panel 3
- **Framer Motion** for animations and transitions
- **Tailwind CSS** for layout and utility styling

## MAPBOX TOKEN

Use this environment variable pattern. The user will supply their own token:
```
VITE_MAPBOX_TOKEN=pk.xxxxx
```
For development, use the Mapbox dark style: `mapbox://styles/mapbox/dark-v11`

## DATA FILES

All data is in the `data/` directory:
- `corridors.json` — The five cities with coordinates, governance typology, market details, health impact data, and U.S. pair info
- `time_series.json` — Seizure data (Mexico national, CBP), treatment mentions (SISVEA), U.S. overdose deaths, methadone patients
- `timeline_events.json` — Key events from 2013-2025 with categories and impact levels

## DESIGN DIRECTION

### Aesthetic: "Intelligence Briefing" 
Dark, precise, editorial. Think classified document meets Financial Times data journalism.

### Colors
- Background: `#0a0e17` (deep navy-black)
- Surface/cards: `#111827` with subtle border `#1e293b`
- Primary text: `#e2e8f0`
- Secondary text: `#94a3b8`
- Accent: `#f97316` (warm orange — nod to InSight Crime's brand)

### Governance Type Colors (CRITICAL — these define the visual identity)
- Monopoly (Mexicali): `#EF4444` (red)
- Oligopoly (Tijuana): `#F97316` (orange)  
- Duopoly (Nogales): `#EAB308` (yellow)
- Fragile Truce (Hermosillo): `#14B8A6` (teal)
- Prohibition (Juárez): `#3B82F6` (blue)

### Typography
- Headers: `"DM Sans", sans-serif` (import from Google Fonts, weight 700)
- Body: `"DM Sans", sans-serif` (weight 400, 500)
- Data/numbers: `"JetBrains Mono", monospace` (import from Google Fonts)

### Key Design Rules
- NO white backgrounds anywhere
- All charts should have dark backgrounds with light gridlines at very low opacity
- Map should fill the viewport width
- Generous spacing between sections
- Subtle glow effects on the governance type colors (box-shadow with the color at low opacity)
- Arc flows on the map should pulse/animate subtly

---

## PANEL 1: "THE CORRIDORS" — INTERACTIVE MAP

### Layout
- Full-width section, height ~70vh
- Map takes up the full area
- Small legend overlay in bottom-left corner showing governance types
- Title overlay in top-left: "Fentanyl Corridors: Criminal Governance & Cross-Border Flows"
- Subtitle: "How criminal groups shape local drug markets in northern Mexico"

### Map Implementation

Use `react-map-gl` with `@deck.gl/react` overlay.

**Layers (in order):**

1. **ScatterplotLayer** — Mexican cities
   - Position: [lng, lat] from corridors.json
   - Radius: proportional to market openness (Tijuana/Mexicali larger, Juárez smaller)
   - Fill color: governance type color
   - Stroke: white at low opacity
   - On hover: show tooltip with city name, governance type, key stats

2. **ScatterplotLayer** — U.S. paired cities
   - Position: [lng, lat] from corridors.json us_pair
   - Smaller radius, white/light gray fill
   - Only for cities that have a us_pair (Hermosillo has null — no U.S. pair)

3. **ArcLayer** — Corridor connections
   - Source: Mexican city coordinates
   - Target: U.S. paired city coordinates
   - Color: governance type color (source) transitioning to white (target)
   - Width: proportional to CBP seizure percentage at that field office
     - San Diego (Tijuana): 45% → thickest
     - Tucson (Nogales): 40% → second thickest
     - El Centro (Mexicali): 7% → thinner
     - El Paso (Juárez): 4% → thinnest
   - Height: 0.5 (moderate arc height)
   - Skip Hermosillo (no U.S. pair — it's an interior transit city)

4. **TextLayer** — City labels
   - Mexican city names in white, slightly above the scatter points
   - U.S. city names in gray, slightly above their points

**Map viewport:**
- Center: [-112.5, 31.5] (roughly centered on the border region)
- Zoom: 5.5
- Pitch: 35 (slight 3D tilt for the arcs)
- Bearing: 0

**Tooltip on hover:**
When hovering over a Mexican city dot, show a styled tooltip card with:
- City name (large)
- Governance type label and colored dot
- Market status (integrated / restricted / sporadic)
- Price per dose
- Key health stat (overdoses per day/week)

### Legend
A small card in the bottom-left corner with:
- Title: "Criminal Governance Type"
- Five rows, each with colored circle + label:
  - 🔴 Monopoly (Mexicali)
  - 🟠 Oligopoly (Tijuana)  
  - 🟡 Duopoly (Nogales)
  - 🟢 Fragile Truce (Hermosillo)
  - 🔵 Prohibition (Juárez)

---

## PANEL 2: "THE ASYMMETRY" — SIDE-BY-SIDE COMPARISON

### Layout
- Full-width section below the map
- Title: "The Asymmetry: Same Corridor, Different Realities"
- Subtitle: "Criminal governance determines whether fentanyl takes root locally — even when massive quantities transit through"
- A row of 4 corridor cards (skip Hermosillo — no U.S. pair), each containing side-by-side mini-charts

### For each corridor card:
- Header: "Tijuana ↔ San Diego" (with governance color accent)
- Two columns: Mexico (left) | United States (right)
- Each column shows 2-3 key metrics as small stat boxes or mini bar charts

### Metrics to show per corridor:

**Tijuana ↔ San Diego**
- MX: Market status "INTEGRATED", price "$2.50/dose", 3 overdoses/day, SEMEFO 12% fentanyl-positive
- US: 45% of all CBP fentanyl seizures, San Diego County overdose data

**Mexicali ↔ Calexico**
- MX: Market status "INTEGRATED", price "$2.50/dose", 5 overdoses/week, SEMEFO 20% fentanyl-positive
- US: 7% of CBP fentanyl seizures

**Nogales ↔ Nogales AZ**
- MX: Market status "RESTRICTED", price "$2.50/dose", 6-9 emergencies/week, NO forensic testing
- US: 40% of CBP fentanyl seizures (second highest!)

**Ciudad Juárez ↔ El Paso**
- MX: Market status "SPORADIC", price "$10/dose" (4x higher!), fentanyl effectively BANNED, NO forensic testing
- US: 4% of CBP fentanyl seizures (despite being a major trafficking corridor)

### Key Visual Insight
The Nogales and Juárez corridors are the "smoking gun" of the governance thesis:
- Nogales has the SECOND HIGHEST U.S. seizure rate but a RESTRICTED local market
- Juárez has massive trafficking volume but virtually NO local consumption
- Visualize this contrast dramatically — maybe a diverging bar chart where U.S. seizures go right and Mexican market penetration goes left

### Implementation
Use Recharts BarChart or custom SVG bars. Dark card backgrounds (`#111827`), governance-colored accents on the left border of each card.

---

## PANEL 3: "THE TIMELINE" — ANIMATED TIME SLIDER

### Layout
- Full-width section
- Title: "The Trajectory of Fentanyl in Mexico's Northern Border"
- A horizontal timeline from 2013 to 2025
- Above the timeline: a line/area chart showing time-series data
- Below the timeline: event markers that can be clicked/hovered for details

### Chart (top portion)
Use Recharts AreaChart with multiple series:
1. Mexican national fentanyl seizures (kg) — left Y-axis — filled area in orange
2. SISVEA treatment mentions — right Y-axis — line in white
3. U.S. synthetic opioid deaths (in thousands) — secondary line in red, dashed

All on dark background. Light gridlines at ~10% opacity.

### Timeline (bottom portion)
A horizontal track with year markers (2013, 2014, ... 2025).
Event dots placed at their corresponding dates:
- Color-coded by category:
  - supply: orange
  - market_introduction: red  
  - health: pink
  - disruption: yellow
  - policy: blue
  - market_evolution: teal
  - outcome: green
- Size: larger for high-impact events
- On hover: show event description in a tooltip
- On click: optionally highlight the corresponding period on the chart above

### Interactive element
A draggable slider or clickable year selector that, when moved:
- Highlights the corresponding year on the chart
- Shows a vertical line on the chart at that year
- Displays a summary stat panel: "In [YEAR]: Mexico seized X kg, Y people sought treatment, Z Americans died from synthetic opioids"

---

## PROJECT STRUCTURE

```
fentanyl-dashboard/
├── public/
│   └── data/
│       ├── corridors.json
│       ├── time_series.json
│       └── timeline_events.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css          (Tailwind + custom styles)
│   ├── components/
│   │   ├── Header.jsx     (project title, attribution)
│   │   ├── CorridorMap.jsx (Panel 1 — deck.gl map)
│   │   ├── MapLegend.jsx   
│   │   ├── MapTooltip.jsx  
│   │   ├── Asymmetry.jsx  (Panel 2 — comparison cards)
│   │   ├── CorridorCard.jsx (individual corridor comparison)
│   │   ├── Timeline.jsx   (Panel 3 — chart + event timeline)
│   │   ├── TimelineChart.jsx
│   │   ├── TimelineEvents.jsx
│   │   └── Footer.jsx     (sources, attribution to InSight Crime)
│   └── utils/
│       └── colors.js      (governance colors, category colors)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                   (VITE_MAPBOX_TOKEN)
└── README.md
```

## SETUP COMMANDS

```bash
npm create vite@latest fentanyl-dashboard -- --template react
cd fentanyl-dashboard
npm install
npm install deck.gl @deck.gl/react @deck.gl/layers react-map-gl mapbox-gl
npm install recharts framer-motion
npm install -D tailwindcss @tailwindcss/postcss postcss
```

## IMPORTANT IMPLEMENTATION NOTES

1. **deck.gl + react-map-gl integration**: Use the `DeckGL` component from `@deck.gl/react` as an overlay on `Map` from `react-map-gl`. The pattern is:
```jsx
import {Map} from 'react-map-gl';
import DeckGL from '@deck.gl/react';

<DeckGL layers={layers} viewState={viewState} controller={true}>
  <Map mapboxAccessToken={TOKEN} mapStyle="mapbox://styles/mapbox/dark-v11" />
</DeckGL>
```

2. **Data loading**: Import JSON files directly or fetch from `/data/` in public folder.

3. **Responsive**: The map should work on desktop (primary target). Mobile is nice-to-have but not critical.

4. **Performance**: deck.gl handles rendering efficiently. Don't worry about optimizing for this data volume — it's only 5-9 points.

5. **Fonts**: Add to index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

6. **Attribution**: The Footer should clearly state:
   "Supplementary visualization for 'Reglas locales, lecciones globales: cómo la gobernanza criminal moldea los mercados de fentanilo en el norte de México' by InSight Crime (March 2026). Data sources: CBP, CDC, INEGI, SISVEA, SEDENA. Dashboard by Luke [Last Name], Case Western Reserve University."

## BUILD AND DEPLOY

```bash
npm run build        # builds to dist/
npm run preview      # local preview of build
```

For deployment, use **Vercel** (free, instant):
```bash
npm i -g vercel
vercel
```
Or **Netlify** or **GitHub Pages**.
