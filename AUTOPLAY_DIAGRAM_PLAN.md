# ANIMATED FENTANYL CORRIDOR DIAGRAM — AUTO-PLAY VERSION
# Master Plan & Claude Code Instructions

---

## ARCHITECTURE: Full-Viewport Auto-Play

```
┌──────────────────────────────────────────────────────┐
│  FULL VIEWPORT (100vw × 100vh)                       │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                │  │
│  │              MAPBOX + DECK.GL MAP              │  │
│  │              (fills entire viewport)            │  │
│  │                                                │  │
│  │   ┌─────────────────────┐                      │  │
│  │   │  CONTENT OVERLAY    │                      │  │
│  │   │  (positioned card)  │                      │  │
│  │   │                     │                      │  │
│  │   │  Fades in/out per   │                      │  │
│  │   │  act on the timer   │                      │  │
│  │   │                     │                      │  │
│  │   └─────────────────────┘                      │  │
│  │                                                │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  CONTROL BAR                                   │  │
│  │  ◄ ▶ ►  ━━━━●━━━━━━━━━━  Act 3: Tijuana  2:15 │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

The map fills the ENTIRE viewport. Content appears as overlay cards — 
positioned in the bottom-left, right side, or wherever makes sense for 
each act. Cards animate in with Framer Motion, stay for their duration, 
then animate out as the next act begins and the map flies to the new location.

A control bar at the bottom provides: play/pause, previous/next act buttons, 
a progress scrubber, current act label, and elapsed time.

---

## TECH STACK

- **React 18 + Vite**
- **react-map-gl** + **deck.gl** (map + layers)
- **Framer Motion** (all overlay animations)
- **Recharts** (mini charts in overlay cards)
- **Tailwind CSS**

---

## ACT TIMING

| Act | Name | Duration | Cumulative |
|-----|------|----------|------------|
| 0 | The Origin (Ports) | 5s | 0:00–0:05 |
| 1 | The Production (Sinaloa) | 5s | 0:05–0:10 |
| 2 | Mexicali | 5s | 0:10–0:15 |
| 3 | Tijuana | 5s | 0:15–0:20 |
| 4 | Hermosillo | 5s | 0:20–0:25 |
| 5 | Nogales | 5s | 0:25–0:30 |
| 6 | Ciudad Juárez | 5s | 0:30–0:35 |
| 7 | The Border Crossing | 5s | 0:35–0:40 |
| 8 | The Crisis | 7s | 0:40–0:47 |
| **Total** | | **47s** | |

These are defaults. The user can pause at any act to read longer.
The timer pauses when the user interacts (clicks a card, hovers something).

---

## STATE MACHINE

```
activeAct: 0-8 (which act is currently playing)
isPlaying: boolean (auto-advance or paused)
elapsed: number (seconds into current act)

On each tick (every 100ms):
  if isPlaying:
    elapsed += 0.1
    if elapsed >= currentActDuration:
      if activeAct < 8:
        activeAct += 1
        elapsed = 0
        triggerMapFlyTo(activeAct)
        triggerContentTransition(activeAct)
      else:
        isPlaying = false  // end of sequence
```

---

## CONTENT OVERLAY POSITIONING

Each act's content card appears in a specific position on screen to avoid 
blocking the important part of the map:

| Act | Card Position | Why |
|-----|--------------|-----|
| 0 (Ports) | Top-right corner | Map focus is Pacific coast (left/center) |
| 1 (Production) | Right side, centered vertically | Map focus is Sinaloa (center-left) |
| 2-6 (Cities) | Left side, centered vertically | Map zooms to city (center-right) |
| 7 (Border) | Center, large overlay | Wide map view, stats are the focus |
| 8 (Crisis) | Center-left, large overlay | Wide map view, narrative is the focus |

Cards should be max-width ~420px for city acts, wider (~600px) for Acts 7-8.

---

## OVERLAY CARD ANIMATION PATTERN

```jsx
<AnimatePresence mode="wait">
  {activeAct === 2 && (
    <motion.div
      key="mexicali-card"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute left-8 top-1/2 -translate-y-1/2"
    >
      <CityCard city={mexicaliData} />
    </motion.div>
  )}
</AnimatePresence>
```

Each card has a UNIQUE key so AnimatePresence properly animates between them.
Cards slide in from their edge (left cards slide from left, right cards from right)
and fade in simultaneously.

---

## CONTROL BAR SPEC

Position: fixed bottom, full width, semi-transparent dark background.
Height: ~60px.

Layout (left to right):
1. **Previous button** (◄) — go to previous act
2. **Play/Pause button** (▶/❚❚) — toggle auto-play
3. **Next button** (►) — go to next act
4. **Progress scrubber** — a thin horizontal bar spanning ~60% of the control bar width
   - Background: dark gray track
   - Filled portion: accent orange, proportional to (currentActIndex / totalActs)
   - 9 small tick marks, one per act
   - Clickable — clicking a position jumps to that act
   - A small dot/handle at the current position
5. **Act label** — "Act 3: Tijuana" in white text
6. **Timer** — "0:18 / 0:47" in JetBrains Mono, gray

Keyboard shortcuts:
- Space: play/pause
- Left arrow: previous act
- Right arrow: next act

---

## DECK.GL LAYERS — SAME AS BEFORE

All the layer specs from the previous plan remain identical:
- Pulsing port dots (Act 0)
- Production hub dot + precursor arcs (Act 1)
- City dots with governance colors that light up sequentially (Acts 2-6)
- Distribution route arcs from Culiacán (Acts 2+)
- Border crossing arcs with thickness by seizure share (Act 7)
- Wide pullback view (Act 8)

The only difference is that layer visibility is driven by activeAct from the 
timer state machine instead of from scroll position.

---

## MAP VIEW STATES — SAME AS BEFORE

```js
export const VIEW_STATES = {
  0: { longitude: -103.5, latitude: 19.0, zoom: 6.5, pitch: 40, bearing: -15 },
  1: { longitude: -107.4, latitude: 24.8, zoom: 7, pitch: 35, bearing: 0 },
  2: { longitude: -115.45, latitude: 32.62, zoom: 9, pitch: 45, bearing: 0 },
  3: { longitude: -117.04, latitude: 32.51, zoom: 9, pitch: 45, bearing: 0 },
  4: { longitude: -110.96, latitude: 29.07, zoom: 9, pitch: 45, bearing: 0 },
  5: { longitude: -110.95, latitude: 31.33, zoom: 9, pitch: 45, bearing: 0 },
  6: { longitude: -106.42, latitude: 31.69, zoom: 9, pitch: 45, bearing: 0 },
  7: { longitude: -112, latitude: 32, zoom: 5.5, pitch: 30, bearing: 0 },
  8: { longitude: -105, latitude: 35, zoom: 4, pitch: 15, bearing: 0 },
};
```

---

## PROJECT STRUCTURE

```
fentanyl-corridors/
├── public/
│   └── data/
│       ├── corridors.json
│       ├── time_series.json
│       ├── timeline_events.json
│       └── routes.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── AutoPlayDiagram.jsx    ← Main container (timer + map + overlays)
│   │   ├── MapView.jsx            ← Mapbox + deck.gl (full viewport)
│   │   ├── ControlBar.jsx         ← Play/pause, scrubber, act label
│   │   ├── ContentOverlay.jsx     ← Manages which card is visible per act
│   │   ├── PortsCard.jsx          ← Act 0 overlay content
│   │   ├── ProductionCard.jsx     ← Act 1 overlay content
│   │   ├── CityCard.jsx           ← Acts 2-6 overlay content (reusable)
│   │   ├── BorderCard.jsx         ← Act 7 overlay content
│   │   ├── CrisisCard.jsx         ← Act 8 overlay content
│   │   └── StatNumber.jsx         ← Animated counting number component
│   ├── hooks/
│   │   └── useAutoPlay.js         ← Timer state machine hook
│   ├── utils/
│   │   ├── colors.js
│   │   ├── mapViewStates.js
│   │   └── actConfig.js           ← Duration, position, title for each act
│   └── data/
│       └── cityCardData.js
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env
└── README.md
```

---

## DESIGN DIRECTION (same as before)

- Background: #0a0e17
- Surface/cards: #111827 with backdrop-blur-md and bg-opacity-90
  (cards are semi-transparent so the map shows through slightly — cinematic feel)
- Text: #e2e8f0 primary, #94a3b8 secondary
- Fonts: DM Sans (text), JetBrains Mono (numbers)
- Governance colors: Red/Orange/Yellow/Teal/Blue
- Cards get a subtle border-glow in the governance color

KEY DIFFERENCE from scroll version: since cards overlay the map, they MUST have 
backdrop-blur and semi-transparency so the map context isn't completely hidden. 
The map is the star — cards are supporting actors.

---

## SETUP COMMANDS

```bash
npm create vite@latest fentanyl-corridors -- --template react
cd fentanyl-corridors
npm install
npm install deck.gl @deck.gl/react @deck.gl/layers @deck.gl/geo-layers react-map-gl mapbox-gl
npm install recharts framer-motion
npm install -D tailwindcss @tailwindcss/postcss postcss
```
