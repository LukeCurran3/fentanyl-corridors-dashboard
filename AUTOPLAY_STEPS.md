# AUTO-PLAY DIAGRAM — Step-by-Step Claude Code Prompts

---

## STEP 1: Project Setup & Foundation

Same as before — no changes. Set up Vite, install deps, configure Tailwind, 
create data directories, add fonts.

### Claude Code prompt:

```
I'm building an auto-playing animated diagram about fentanyl trafficking 
corridors in Mexico. Read the file AUTOPLAY_DIAGRAM_PLAN.md for the full 
specification.

For this first step, set up the project foundation:

1. Initialize a Vite + React project in the current directory
2. Install all dependencies:
   deck.gl @deck.gl/react @deck.gl/layers @deck.gl/geo-layers
   react-map-gl mapbox-gl
   recharts framer-motion
   tailwindcss @tailwindcss/postcss postcss (dev deps)
3. Configure Tailwind with postcss.config.js and tailwind.config.js
4. Set up index.css with Tailwind directives and these CSS variables:
   --bg-primary: #0a0e17;
   --bg-surface: #111827;
   --bg-card: rgba(26, 31, 46, 0.9);
   --border: #1e293b;
   --text-primary: #e2e8f0;
   --text-secondary: #94a3b8;
   --accent: #f97316;
   Also add: html, body, #root { height: 100vh; overflow: hidden; }
   This is critical — the entire app is a single viewport with no scrolling.
5. Add Google Fonts to index.html: DM Sans (400,500,700) and JetBrains Mono (400,500)
6. Set font-family on body to 'DM Sans', background to #0a0e17
7. Create .env with VITE_MAPBOX_TOKEN=placeholder
8. Create directories: src/components/, src/hooks/, src/utils/, src/data/, public/data/
9. Copy the four JSON data files (corridors.json, time_series.json, 
   timeline_events.json, routes.json) into public/data/
10. Create src/utils/colors.js with governance color exports
11. Create src/utils/mapViewStates.js with all 9 camera positions (see plan)
12. Create src/utils/actConfig.js exporting an array of act configurations:
    [
      { id: 0, title: "The Origin", subtitle: "Pacific Ports", duration: 5, cardPosition: "top-right" },
      { id: 1, title: "The Production", subtitle: "Sinaloa", duration: 5, cardPosition: "right" },
      { id: 2, title: "Mexicali", subtitle: "Baja California", duration: 5, cardPosition: "left" },
      { id: 3, title: "Tijuana", subtitle: "Baja California", duration: 5, cardPosition: "left" },
      { id: 4, title: "Hermosillo", subtitle: "Sonora", duration: 5, cardPosition: "left" },
      { id: 5, title: "Nogales", subtitle: "Sonora", duration: 5, cardPosition: "left" },
      { id: 6, title: "Ciudad Juárez", subtitle: "Chihuahua", duration: 5, cardPosition: "left" },
      { id: 7, title: "The Crossing", subtitle: "The Border", duration: 5, cardPosition: "center" },
      { id: 8, title: "The Crisis", subtitle: "Both Sides", duration: 7, cardPosition: "center-left" },
    ]
13. Make App.jsx render centered text "Fentanyl Corridors" on dark bg

Make sure `npm run dev` runs. No scrolling — the page should be exactly 100vh.
```

### ✅ Check: Dark page, no scrollbars, text centered. Replace .env token with your real Mapbox token.

---

## STEP 2: Timer State Machine + Control Bar

### What this does:
Builds the auto-play engine and the control bar UI. This is the backbone 
of the auto-play version — everything else reacts to the activeAct state.

### Claude Code prompt:

```
Now build the auto-play timer and control bar. Reference AUTOPLAY_DIAGRAM_PLAN.md.

Build these:

1. src/hooks/useAutoPlay.js — Custom hook that manages the playback state machine.

   State:
   - activeAct (number 0-8)
   - isPlaying (boolean, starts as false — user must press play)
   - elapsed (number, seconds into current act)

   Returns:
   { activeAct, isPlaying, elapsed, totalDuration, play, pause, toggle, 
     nextAct, prevAct, goToAct, currentActConfig }

   Logic:
   - Use useRef for an interval (setInterval at 100ms)
   - When isPlaying is true, increment elapsed by 0.1 every tick
   - When elapsed >= current act's duration (from actConfig.js):
     - If activeAct < 8: advance to next act, reset elapsed to 0
     - If activeAct === 8: set isPlaying to false (sequence complete)
   - nextAct(): go to next act immediately, reset elapsed
   - prevAct(): go to previous act, reset elapsed  
   - goToAct(n): jump to act n, reset elapsed
   - toggle(): flip isPlaying
   - totalDuration: sum of all act durations (47s)
   - Calculate cumulative elapsed: sum of previous acts' durations + current elapsed

   Add keyboard listeners:
   - Space bar: toggle play/pause
   - Right arrow: nextAct
   - Left arrow: prevAct

2. src/components/ControlBar.jsx — The playback control bar.

   Position: fixed, bottom: 0, full width, z-50.
   Background: rgba(10, 14, 23, 0.85) with backdrop-blur-md.
   Height: 64px. Padding: 0 24px.
   Border-top: 1px solid #1e293b.

   Layout (flexbox, items-center, justify between):

   LEFT SECTION (controls):
   - Previous button: ◄ icon (simple SVG or unicode ◀), onClick: prevAct
   - Play/Pause button: ▶ when paused, ❚❚ when playing. Larger than prev/next.
     Style: 40px circle, accent orange background when playing, dark when paused
   - Next button: ► icon, onClick: nextAct
   - Gap of 16px between buttons
   - Buttons are white, hover: accent orange

   CENTER SECTION (progress scrubber):
   - A container div spanning ~60% of the bar width
   - Background track: h-1 rounded-full bg-[#1e293b]
   - Filled portion: h-1 rounded-full bg-[#f97316], width = (cumulativeElapsed / totalDuration * 100)%
   - 9 tick marks evenly spaced along the track (small 8px tall lines)
   - Each tick is clickable — onClick: goToAct(tickIndex)
   - Active tick is brighter
   - A small circle handle (10px) at the current progress position

   RIGHT SECTION (info):
   - Act label: "Act 3: Tijuana" in white, DM Sans, font-medium
   - Timer: "0:18 / 0:47" in JetBrains Mono, text-sm, text-[#94a3b8]
   - Format elapsed as M:SS

3. src/components/AutoPlayDiagram.jsx — Main container.
   - Renders at 100vw × 100vh, position: relative, overflow: hidden
   - Uses useAutoPlay hook
   - Renders:
     - MapView (full viewport, z-0) — pass activeAct
     - ContentOverlay (z-10) — pass activeAct and currentActConfig
     - ControlBar (z-50) — pass all controls
   - For now, MapView is a placeholder dark div
   - ContentOverlay shows: "Act {activeAct}: {title}" as white text

4. Update App.jsx to render AutoPlayDiagram only.

The key behavior to verify: 
- Press play → the act number advances every 5 seconds
- The progress bar fills smoothly
- Previous/next buttons work
- Space bar toggles play/pause
- Clicking ticks on the scrubber jumps to that act
- Timer display updates in real-time
- It stops at the end (Act 8)
```

### ✅ Check: You should see the control bar at the bottom. Press play — the act label should advance every 5 seconds. Click the scrubber ticks to jump around. Verify keyboard shortcuts work. This is your playback engine — it needs to be solid before building anything on top of it.

---

## STEP 3: The Full-Viewport Map with FlyTo

### Claude Code prompt:

```
Now build the real map. Reference AUTOPLAY_DIAGRAM_PLAN.md for camera positions.

Replace the MapView placeholder with:

1. src/components/MapView.jsx
   - Fills parent container (100% width and height)
   - Uses react-map-gl Map with DeckGL overlay from @deck.gl/react
   - Mapbox style: "mapbox://styles/mapbox/dark-v11"
   - Token: import.meta.env.VITE_MAPBOX_TOKEN

   - Receives activeAct as prop
   - Import VIEW_STATES from mapViewStates.js
   - When activeAct changes, update the viewState to VIEW_STATES[activeAct]
   
   For smooth flyTo transitions, manage viewState with useState.
   When activeAct changes (useEffect), update viewState with:
   {
     ...VIEW_STATES[activeAct],
     transitionDuration: 2000,
     transitionInterpolator: new FlyToInterpolator()
   }
   
   Import FlyToInterpolator from react-map-gl.

   - Pass empty layers array to DeckGL for now
   - The map should be interactive (user can drag/zoom even during auto-play)
   - But when a new act triggers, the programmatic flyTo overrides user position

2. Add a subtle vignette overlay div on top of the map:
   - position: absolute, inset: 0, pointer-events: none, z-10
   - Background: radial-gradient(ellipse at center, transparent 50%, rgba(10,14,23,0.6) 100%)
   - This darkens the map edges and makes overlay cards pop

3. Add a minimal title in the top-left corner:
   - position: absolute, top: 24px, left: 24px, z-20
   - "FENTANYL CORRIDORS" in small caps, letter-spacing wide, text-sm
   - "Criminal Governance & Cross-Border Drug Markets" subtitle below, text-xs, gray
   - Very subtle — this is a persistent watermark, not a hero title

The key behavior: press play and watch the map smoothly fly between 
all 9 camera positions. The transitions should take ~2 seconds each, 
with the remaining act duration spent viewing that location.
Verify that every camera position feels right:
- Act 0: you should see the Pacific coast of Mexico
- Act 1: centered on Culiacán/Sinaloa
- Acts 2-6: zoomed into each border city
- Act 7: wide view of the entire border
- Act 8: both countries visible
```

### ✅ Check: Press play. The map should fly smoothly through all 9 positions. Spend time here evaluating camera angles — if a city doesn't look right at zoom 9, adjust the coordinates or zoom in mapViewStates.js. The pitch at 45° during city acts should give a nice 3D feel.

---

## STEP 4: deck.gl Layers — Ports, Production, Routes

### Claude Code prompt:

```
Now add the first deck.gl layers: ports, production hub, and route arcs.

In MapView.jsx, build a function getLayers(activeAct) that returns the 
appropriate deck.gl layers based on which act is active.

Fetch data: load routes.json and corridors.json from /data/ using fetch 
in a useEffect, store in state.

LAYERS FOR ACT 0 (Ports):

ScatterplotLayer id="port-dots":
- Data: routes.json → ports array (Manzanillo and Lázaro Cárdenas)
- getPosition: d => d.coordinates
- getFillColor: [6, 182, 212] (cyan)
- radiusMinPixels: 10
- Pulsing: use a time-based animation. Create a state variable `animationTime` 
  that updates via requestAnimationFrame. Use it to modulate radius:
  getRadius: () => 15000 + 5000 * Math.sin(animationTime * 3)
  Remember to do this outside the layer to avoid re-renders — use useRef for the 
  animation frame and a forceUpdate pattern or deck.gl's built-in props.
  
  SIMPLER APPROACH: Use radiusMinPixels and update it with useState + setInterval:
  Every 500ms toggle between 10 and 16. This creates a visible pulse.
- pickable: false (no tooltips needed for ports)
- visible: activeAct >= 0

TextLayer id="port-labels":
- Data: routes.json → ports array
- getText: d => d.name
- getPosition: d => [d.coordinates[0], d.coordinates[1] + 0.15]
- getColor: [6, 182, 212, 200]
- getSize: 14
- fontFamily: 'DM Sans'
- visible: activeAct <= 1

LAYERS FOR ACT 1+ (Production):

ScatterplotLayer id="production-dot":
- Data: routes.json → production array (Culiacán)
- getFillColor: [249, 115, 22] (orange)
- Same pulsing pattern but larger
- radiusMinPixels: 14
- visible: activeAct >= 1

ArcLayer id="precursor-arcs":
- Data: build from routes.json — two arcs: Manzanillo→Culiacán, Lázaro Cárdenas→Culiacán
- getSourcePosition: port coordinates
- getTargetPosition: Culiacán coordinates
- getSourceColor: [6, 182, 212, 180]
- getTargetColor: [249, 115, 22, 180]
- getWidth: 3
- getHeight: 0.4
- visible: activeAct >= 1

LAYERS FOR ACT 2+ (Distribution routes from Sinaloa):

ArcLayer id="distribution-arcs":
- Data: three arcs from Culiacán toward each border corridor:
  - Culiacán → Mexicali/Tijuana area (endpoint: [-115.45, 32.62])
  - Culiacán → Hermosillo/Nogales area (endpoint: [-110.95, 31.33])
  - Culiacán → Ciudad Juárez (endpoint: [-106.42, 31.69])
- getSourcePosition: Culiacán coordinates
- getTargetPosition: endpoint coordinates
- getSourceColor: [249, 115, 22, 150] (orange, semi-transparent)
- getTargetColor: governance color of destination at 150 alpha:
  - Baja route: [239, 68, 68, 150] (red for Mexicali)
  - Sonora route: [234, 179, 8, 150] (yellow for Nogales)
  - Chihuahua route: [59, 130, 246, 150] (blue for Juárez)
- getWidth: 2
- getHeight: 0.3
- visible: activeAct >= 2

For layer transitions: use the opacity property to fade layers in/out.
When a layer first becomes visible, it should fade in over ~500ms.
deck.gl supports transitions prop:
  transitions: { getWidth: 500, getFillColor: 500 }

For pulsing dots, the cleanest approach:
- Use useRef to store the animation frame ID
- Use a separate state `pulsePhase` that updates via requestAnimationFrame
- Pass pulsePhase into the layer's getRadius callback
- Call deck.gl's `setNeedsRedraw()` or just update a state to trigger re-render
  Actually simplest: use `currentTime` as a data prop so the layer re-renders:
  
  const [time, setTime] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTime(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);
  
  Then in ScatterplotLayer:
  radiusMinPixels: time % 2 === 0 ? 10 : 16
```

### ✅ Check: Press play. At Act 0 you should see pulsing cyan dots on the Pacific coast. At Act 1, Culiacán appears with arcs from the ports. At Act 2+, distribution arcs split northward. The arcs should look good with the 3D pitch.

---

## STEP 5: City Dots with Governance Glow

### Claude Code prompt:

```
Now add the corridor city dots that activate sequentially during Acts 2-6.

Load corridors.json data (if not already loaded).

Add to getLayers():

ScatterplotLayer id="city-dots":
- Data: all 5 cities from corridors.json
- getPosition: d => [d.lng, d.lat]
- getFillColor: for each city, check if it's the "active" city for the current act:
  - Act 2 active city: mexicali
  - Act 3: tijuana
  - Act 4: hermosillo
  - Act 5: nogales
  - Act 6: juarez
  - Acts 7-8: ALL active
  
  If active: use the city's governance color at full alpha (e.g., [239, 68, 68, 255])
  If previously visited (act index < activeAct's city index): governance color at 150 alpha
  If not yet visited: [100, 100, 100, 60] (dim gray)
  
- getRadius: active city → 20000 (with pulse), visited → 12000, not visited → 8000
- radiusMinPixels: active → 14 (pulsing to 20), visited → 8, not visited → 5
- visible: activeAct >= 2
- pickable: false

ScatterplotLayer id="city-glow" (BEHIND city-dots for glow effect):
- Same data, same positions
- getFillColor: governance color at 40 alpha for active city, 0 for others
- getRadius: active city → 40000
- radiusMinPixels: 30
- This creates a subtle colored halo behind the active city dot
- visible: activeAct >= 2

TextLayer id="city-labels":
- Data: all 5 cities
- getPosition: d => [d.lng, d.lat + 0.06]
- getText: d => d.name
- getColor: active city → [255,255,255,255], visited → [200,200,200,180], 
  not visited → [150,150,150,80]
- getSize: active → 16, others → 12
- fontFamily: 'DM Sans'
- fontWeight: active ? 700 : 400
- visible: activeAct >= 2

For Acts 7-8, also add U.S. city dots:

ScatterplotLayer id="us-city-dots":
- Data: filter corridors.json for cities with non-null us_pair
- getPosition: d => [d.us_pair.lng, d.us_pair.lat]
- getFillColor: [226, 232, 240, 160]
- radiusMinPixels: 6
- visible: activeAct >= 7

TextLayer id="us-city-labels":
- Similar to above but for U.S. cities
- visible: activeAct >= 7

The visual effect: as the auto-play advances through cities, each one 
"lights up" with a colored glow while the previous ones stay visible 
but dimmer. By Act 7, you should see a trail of 5 colored dots along 
the border, each in their governance color — a visual map of the typology.
```

### ✅ Check: Play through Acts 2-6 and watch each city light up. The glow effect should be visible but subtle. By Act 7, all five dots should be lit up in their colors along the border.

---

## STEP 6: City Cards — Content Overlays

### Claude Code prompt:

```
Now build the overlay cards that appear on top of the map for each act.

Create these components:

1. src/data/cityCardData.js — Export all city card content:
   (I'll provide the full data — use corridors.json data plus these key insights):
   
   For each city export an object with:
   { id, name, state, governanceType, governanceLabel, governanceColor, 
     groups (array of strings), marketStatus, forms (array), priceUsd, 
     introMethod, healthStat, semefoTesting (bool), naloxoneAvailable (bool),
     harmReductionOrgs (bool), keyInsight (string) }

   Use the data from corridors.json. Key insights:
   
   mexicali: "Most regulated drug market on the border — standardized doses, sealed packages, uniform prices. Even smoking pipes are controlled."
   tijuana: "~70% of homicides tied to drug market rules. Crossing invisible faction borders risks death."
   hermosillo: "Decades-long 'pax narca' kept fentanyl underground. The truce shattered in late 2024."
   nogales: "Railroad tracks split the city between two criminal empires. Wrong substance on the wrong side means disappearance."
   juarez: "Fentanyl is banned by local cartels despite massive trafficking through Juárez-El Paso. Price: $10/dose — 4× the border average."

2. src/components/CityCard.jsx — Reusable city info card.
   
   Max-width: 400px. Semi-transparent background: rgba(17, 24, 39, 0.92).
   backdrop-filter: blur(12px). Border: 1px solid rgba(30, 41, 59, 0.8).
   border-radius: 16px. Padding: 28px. 
   Left border: 4px solid [governance color].
   Subtle box-shadow with governance color at 15% opacity.

   Content layout (top to bottom):
   a) City name (text-2xl, bold, white) + State (text-sm, gray) on same line
   b) Governance badge: small rounded pill with governance color bg at 20%, 
      governance color text. E.g., "MONOPOLY" or "TOTAL PROHIBITION"
   c) Criminal groups: list in text-sm gray, comma-separated
   d) Thin divider (#1e293b)
   e) MARKET section:
      - Status badge: "INTEGRATED" (red), "RESTRICTED" (yellow), "SPORADIC" (blue)
        as a small pill component
      - "Forms:" + list of fentanyl formats
      - Price in large JetBrains Mono: "$2.50/dose"
   f) Thin divider
   g) HEALTH section:
      - Key stat in JetBrains Mono (e.g., "3 ODs/day")
      - Three small indicator dots:
        - SEMEFO: green dot if true, red dot if false
        - Naloxone: green/red
        - Harm Reduction: green/red
        - Label each with tiny text
   h) KEY INSIGHT box:
      - Slightly lighter background, governance color left border
      - Italic text, the memorable quote

3. src/components/PortsCard.jsx — Act 0 overlay.
   Max-width: 380px. Same glass-morphism styling.
   - Title: "Pacific Ports: The Entry Point"
   - Bullet points about precursor chemicals
   - Styled with cyan accent color

4. src/components/ProductionCard.jsx — Act 1 overlay.
   - Title: "Sinaloa: The Lab"  
   - Key facts about production
   - Stat: "102 kg seized in 2017 → 2,838 kg in 2024"
   - Orange accent

5. src/components/BorderCard.jsx — Act 7 overlay.
   Max-width: 500px (wider — this is the big stat moment).
   - Huge "90%" in JetBrains Mono, white, ~80px font size
   - "of fentanyl crosses into the United States"
   - "~10% stays in Mexico's local markets"
   - Horizontal bar chart showing seizure % by corridor (4 bars)
   - "FY2025: 11,486 lbs seized — down 46% from 2024"

6. src/components/CrisisCard.jsx — Act 8 overlay.
   Max-width: 520px.
   - Big stat: "48,422 deaths" in large JetBrains Mono
   - "U.S. synthetic opioid deaths in 2024 — down 27%"  
   - Then the Mexico crisis points as a bulleted list with red indicators
   - Closing paragraph about the need for action
   - Small Recharts AreaChart (200px tall) showing US deaths 2015-2024

7. src/components/ContentOverlay.jsx — Manager component.
   - Receives activeAct from AutoPlayDiagram
   - Uses Framer Motion AnimatePresence with mode="wait"
   - Based on activeAct, renders the correct card component
   - Each card wrapped in motion.div with:
     - Position based on actConfig cardPosition:
       "top-right": absolute top-8 right-8
       "right": absolute right-8 top-1/2 -translate-y-1/2
       "left": absolute left-8 top-1/2 -translate-y-1/2
       "center": absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
       "center-left": absolute left-12 top-1/2 -translate-y-1/2
     - initial: { opacity: 0, y: 20, scale: 0.97 }
     - animate: { opacity: 1, y: 0, scale: 1 }
     - exit: { opacity: 0, y: -20, scale: 0.97 }
     - transition: { duration: 0.5, ease: "easeOut" }
   - Each card has a UNIQUE key prop (e.g., key={`act-${activeAct}`})
     so AnimatePresence properly animates between them

Position the cards to avoid the control bar (bottom 64px) and the title 
watermark (top-left). City cards (left-positioned) should have their 
vertical center slightly above the map's center to feel balanced.
```

### ✅ Check: Play through all acts. Each card should smoothly fade in, display its content, then fade out as the next act begins. The cards should be readable against the dark map with the backdrop blur effect. Check that cards don't overlap the control bar or the title watermark.

**PAUSE HERE.** This is the most important review point. Read through every single card. Is the information accurate? Is it readable? Do the governance colors come through clearly? Are the key insights impactful? Adjust content or sizing before moving on.

---

## STEP 7: Border Crossing Arcs (Act 7)

### Claude Code prompt:

```
Now add the dramatic border crossing arcs for Act 7.

Add to getLayers() in MapView.jsx:

ArcLayer id="border-arcs":
- Data: build from corridors.json — filter cities with non-null us_pair (4 cities)
- getSourcePosition: d => [d.lng, d.lat]
- getTargetPosition: d => [d.us_pair.lng, d.us_pair.lat]
- getSourceColor: parse the governance color hex to RGBA array for each city
- getTargetColor: [226, 232, 240, 200] (white/light gray)
- getWidth: proportional to CBP seizure share:
  Map the seizure_pct from routes.json border_crossings:
  tijuana (45%) → width 12
  nogales (40%) → width 10
  mexicali (7%) → width 3
  juarez (4%) → width 2
- getHeight: 0.5
- visible: activeAct >= 7

These arcs should be the thickest, most visually prominent arcs in the 
entire diagram. They're the climax — everything has been building to this.

The visual thesis is immediately apparent: the thick orange arc (Tijuana) 
and thick yellow arc (Nogales) dominate, while the thin blue arc (Juárez) 
is barely visible — despite Juárez being a major trafficking hub. 
Juárez's thinness reflects that only 4% of seizures happen there, even 
though massive volumes transit through. The governance structure (prohibition) 
keeps the local market suppressed.

Add a brief entrance transition — the arcs should appear to "draw" across 
the border over about 1 second when Act 7 activates.
Use getHeight with a transition that animates from 0 to 0.5:
  transitions: { getHeight: { duration: 1000, enter: () => [0] } }
```

### ✅ Check: When Act 7 hits, four arcs should dramatically fire across the border. The Tijuana and Nogales arcs should be clearly thicker than the others. The Juárez arc should be noticeably thin.

---

## STEP 8: Polish — Animations, Glow, Final Touches

### Claude Code prompt:

```
Final polish pass. Make this feel cinematic.

1. STAT NUMBER ANIMATION:
   Create src/components/StatNumber.jsx:
   - Takes a target number and formats it
   - When it mounts, counts up from 0 to the target number over 1 second
   - Use Framer Motion useMotionValue + animate, or a simple 
     requestAnimationFrame counter
   - Display in JetBrains Mono, large, white
   - Use this for "90%", "48,422", and other big stats in the overlay cards

2. CARD STAGGER: Inside CityCard, each section (governance, market, health, 
   key insight) should animate in with a slight stagger (100ms delay each) 
   using Framer Motion staggerChildren.

3. ACT TITLE ON MAP: Add a subtle act indicator in the top-right of the map:
   - "ACT 1" in small caps, accent orange, JetBrains Mono
   - "THE ORIGIN" below in white, text-sm
   - This changes with each act using AnimatePresence for smooth transitions

4. INITIAL STATE: When the page first loads (before play is pressed):
   - Show the map at a wide view of Mexico (zoom ~5, centered on the country)
   - Overlay a semi-transparent panel in the center with:
     - "FENTANYL CORRIDORS" in large text
     - "How Criminal Governance Shapes Drug Markets in Northern Mexico"
     - "Supplementary visualization for InSight Crime's 'Reglas locales, lecciones globales' (March 2026)"
     - A large PLAY button (circle with ▶) in accent orange
     - "Press Play or use Space to begin"
   - When play is pressed, this panel fades out and Act 0 begins
   - This is the "title card" — the first thing visitors see

5. END STATE: When Act 8's duration finishes:
   - The control bar shows "Replay" instead of "Play"
   - An ending overlay fades in with:
     - "Sources: InSight Crime, CBP, CDC, INEGI, SISVEA, SEDENA"
     - "Built by Luke [Last Name] — Case Western Reserve University"
     - "View the full report: insightcrime.org"
     - A "Replay" button

6. LOADING STATE: Show a minimal loader while Mapbox tiles and data load:
   - Dark background with a pulsing orange dot
   - "Loading corridors..." in gray text

7. RESPONSIVE: On screens < 1024px wide:
   - Show a message: "This visualization is designed for desktop. 
     Please view on a wider screen for the best experience."
   - Don't attempt to render the full map on mobile

8. CLEANUP:
   - Remove console.logs
   - Check all text for typos
   - Verify all data values match corridors.json
   - Test play/pause/next/prev thoroughly
   - Test keyboard shortcuts
   - Run npm run build — fix any errors
```

### ✅ Check: Full playthrough from title card to end card. Watch it like a viewer would, not a developer. Does it tell a compelling story? Does the pacing feel right (adjust act durations in actConfig.js if needed)? Does the title card make you want to press play?

---

## STEP 9: README + Deploy

### Claude Code prompt:

```
Write a professional README.md:

1. Title: "Fentanyl Corridors: Criminal Governance & Cross-Border Drug Markets in Northern Mexico"
2. One-paragraph description: This interactive animated visualization traces the 
   flow of illicit fentanyl from Chinese precursor imports through Mexican 
   production centers to five border cities, visualizing how different criminal 
   governance structures shape whether fentanyl takes root locally. Supplementary 
   material for InSight Crime's report "Reglas locales, lecciones globales" (March 2026).
3. Key findings section (4 bullets from the report)
4. Data sources with URLs: CBP, CDC WONDER, INEGI, SISVEA, DEA, InSight Crime
5. Tech stack
6. How to run: clone, npm install, add VITE_MAPBOX_TOKEN to .env, npm run dev
7. Full citation of the InSight Crime report
8. Author: Luke [Last Name], Case Western Reserve University
9. MIT License

Also create .gitignore: node_modules, dist, .env, .DS_Store
```

### Deploy:
```bash
git add .
git commit -m "Fentanyl Corridors: animated visualization of criminal governance and drug markets"
git push origin main
vercel  # follow prompts, set VITE_MAPBOX_TOKEN env var in dashboard
```

---

## ESTIMATED TIME

| Step | What | Time |
|------|------|------|
| 1 | Project setup | 30 min |
| 2 | Timer + control bar | 2-3 hrs |
| 3 | Base map + flyTo | 1-2 hrs |
| 4 | Port/production/route layers | 2-3 hrs |
| 5 | City dots + glow | 1-2 hrs |
| 6 | All overlay cards (content-heavy) | 3-5 hrs |
| 7 | Border crossing arcs | 1 hr |
| 8 | Polish + animations + title/end | 3-4 hrs |
| 9 | README + deploy | 30 min |
| **Total** | | **15-22 hrs** |
