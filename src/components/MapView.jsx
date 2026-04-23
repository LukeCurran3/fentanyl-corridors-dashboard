import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DeckGL from '@deck.gl/react'
import { FlyToInterpolator } from '@deck.gl/core'
import { ScatterplotLayer, ArcLayer, TextLayer, GeoJsonLayer, PathLayer } from '@deck.gl/layers'
import { Map } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { VIEW_STATES } from '../utils/mapViewStates'
import { ACT_CONFIG } from '../utils/actConfig'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

// Wide Mexico overview shown before the experience starts
const TITLE_VIEW_STATE = {
  longitude: -102,
  latitude:  23,
  zoom:      4.5,
  pitch:     20,
  bearing:   0,
}

// GeoJSON boundary config
const CITY_BOUNDARY_CONFIG = [
  { id: 'sinaloa_state', color: [249, 115, 22], visibleFromAct: 1 },
  { id: 'hermosillo',    color: [20,  184, 166], visibleFromAct: 2 },
  { id: 'nogales',       color: [234, 179, 8],   visibleFromAct: 3 },
  { id: 'mexicali',      color: [239, 68,  68],  visibleFromAct: 4 },
  { id: 'tijuana',       color: [249, 115, 22],  visibleFromAct: 5 },
  { id: 'juarez',        color: [59,  130, 246], visibleFromAct: 7 },
]

const CITY_ACT = {
  hermosillo: 2,
  nogales:    3,
  mexicali:   4,
  tijuana:    5,
  juarez:     7,
}

// CBP seizure share → arc width for border crossing arcs
const BORDER_ARC_WIDTH = { tijuana: 12, nogales: 10, mexicali: 3, juarez: 2 }

function cityStatus(cityId, activeAct) {
  const actNum = CITY_ACT[cityId]
  if (actNum === undefined) return 'unvisited'
  if (activeAct >= 8)       return 'visited'
  if (activeAct === actNum) return 'active'
  if (activeAct > actNum)   return 'visited'
  return 'unvisited'
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [200, 200, 200]
}

const US_MEXICO_BORDER = [
  [-117.128, 32.534], [-116.935, 32.534], [-116.063, 32.634],
  [-115.472, 32.726], [-114.835, 32.753], [-114.035, 32.512],
  [-113.123, 31.893], [-111.074, 31.341], [-110.941, 31.341],
  [-109.548, 31.341], [-108.217, 31.779], [-107.641, 31.738],
  [-106.489, 31.760], [-105.997, 31.376], [-104.827, 29.542],
  [-103.558, 29.066], [-102.879, 29.516], [-101.362, 29.782],
  [-100.952, 29.361], [-99.508,  27.499], [-98.136,  26.052],
  [-97.483,  25.958], [-97.158,  25.961],
]

// ── Layer builder ──────────────────────────────────────────────────────────────
function getLayers(activeAct, routeData, cityGeoJson, corridorCities, pulse) {
  if (!routeData || !corridorCities) return []

  const { ports, production, distributionArcs } = routeData
  const culiacan        = production[0].coordinates
  const precursorArcs   = ports.map(p => ({ src: p.coordinates, tgt: culiacan }))
  const visibleDistArcs = distributionArcs.filter(a => activeAct >= a.visibleFromAct)
  const usCities        = corridorCities.filter(c => c.us_pair !== null)

  return [
    // ── Act 8+: US–Mexico border glow + line ─────────────────────────────
    new PathLayer({
      id: 'border-glow',
      data: [{ path: US_MEXICO_BORDER }],
      getPath: d => d.path,
      getColor: [239, 68, 68, 55],
      getWidth: 18000,
      widthMinPixels: 10,
      widthMaxPixels: 20,
      visible: activeAct >= 8,
    }),
    new PathLayer({
      id: 'border-line',
      data: [{ path: US_MEXICO_BORDER }],
      getPath: d => d.path,
      getColor: [239, 68, 68, 230],
      getWidth: 3000,
      widthMinPixels: 2,
      widthMaxPixels: 4,
      visible: activeAct >= 8,
    }),

    // ── GeoJSON city / state boundaries ──────────────────────────────────
    ...CITY_BOUNDARY_CONFIG
      .filter(c => activeAct >= c.visibleFromAct && cityGeoJson[c.id])
      .map(c => new GeoJsonLayer({
        id: `boundary-${c.id}`,
        data: cityGeoJson[c.id],
        stroked: true,
        filled: true,
        getFillColor: [...c.color, 18],
        getLineColor: [...c.color, 180],
        lineWidthMinPixels: 1.5,
        getLineWidth: 120,
        pickable: false,
      })),

    // ── Act 1+: Colored halos behind each active corridor city dot ────────
    new ScatterplotLayer({
      id: 'city-glow',
      data: corridorCities,
      getPosition: d => [d.lng, d.lat],
      getFillColor: d => {
        const s = cityStatus(d.id, activeAct)
        if (s === 'unvisited') return [0, 0, 0, 0]
        const rgb = hexToRgb(d.governance.color)
        return [...rgb, s === 'active' ? 50 : 20]
      },
      getRadius: d => cityStatus(d.id, activeAct) === 'active' ? 45000 : 28000,
      radiusMinPixels: d => cityStatus(d.id, activeAct) === 'active' ? 32 : 18,
      radiusMaxPixels: 80,
      visible: activeAct >= 1,
      pickable: false,
    }),

    // ── Act 2+: Distribution arcs (per-hop, accumulate) ──────────────────
    new ArcLayer({
      id: 'distribution-arcs',
      data: visibleDistArcs,
      getSourcePosition: d => d.from,
      getTargetPosition: d => d.to,
      getSourceColor: d => [...d.sourceColor, 180],
      getTargetColor: d => [...d.targetColor, 180],
      getWidth: d => d.width,
      getHeight: d => d.height,
      visible: activeAct >= 2,
    }),

    // ── Act 1+: Precursor arcs port → Culiacán ───────────────────────────
    new ArcLayer({
      id: 'precursor-arcs',
      data: precursorArcs,
      getSourcePosition: d => d.src,
      getTargetPosition: d => d.tgt,
      getSourceColor: [34, 197, 94, 190],
      getTargetColor: [34, 197, 94, 190],
      getWidth: 3,
      getHeight: 0.4,
      visible: activeAct >= 1,
    }),

    // ── Act 8+: US city dots ──────────────────────────────────────────────
    new ScatterplotLayer({
      id: 'us-city-dots',
      data: usCities,
      getPosition: d => [d.us_pair.lng, d.us_pair.lat],
      getFillColor: [226, 232, 240, 160],
      getRadius: 8000,
      radiusMinPixels: 6,
      radiusMaxPixels: 14,
      visible: activeAct >= 8,
      pickable: false,
    }),

    // ── Act 0+: Pulsing port dots ─────────────────────────────────────────
    new ScatterplotLayer({
      id: 'port-dots',
      data: ports,
      getPosition: d => d.coordinates,
      getFillColor: [6, 182, 212],
      getRadius: 12000,
      radiusMinPixels: pulse ? 12 : 8,
      radiusMaxPixels: 30,
      visible: activeAct >= 0,
      transitions: { radiusMinPixels: 400 },
      pickable: false,
    }),

    // ── Act 1+: Corridor city dots ────────────────────────────────────────
    new ScatterplotLayer({
      id: 'city-dots',
      data: corridorCities,
      getPosition: d => [d.lng, d.lat],
      getFillColor: d => {
        const s = cityStatus(d.id, activeAct)
        if (s === 'unvisited') return [100, 100, 100, 60]
        const rgb = hexToRgb(d.governance.color)
        return [...rgb, s === 'active' ? 255 : 150]
      },
      getRadius: d => {
        const s = cityStatus(d.id, activeAct)
        if (s === 'active')  return 20000
        if (s === 'visited') return 12000
        return 8000
      },
      radiusMinPixels: d => {
        const s = cityStatus(d.id, activeAct)
        if (s === 'active')  return pulse ? 20 : 14
        if (s === 'visited') return 8
        return 5
      },
      radiusMaxPixels: 30,
      visible: activeAct >= 1,
      transitions: { radiusMinPixels: 400 },
      pickable: false,
    }),

    // ── Act 7+: Border crossing arcs — the climax ────────────────────────
    new ArcLayer({
      id: 'border-arcs',
      data: activeAct >= 7 ? corridorCities.filter(c => c.us_pair !== null) : [],
      getSourcePosition: d => [d.lng, d.lat],
      getTargetPosition: d => [d.us_pair.lng, d.us_pair.lat],
      getSourceColor: d => [...hexToRgb(d.governance.color), 220],
      getTargetColor: [226, 232, 240, 200],
      getWidth: d => BORDER_ARC_WIDTH[d.id] ?? 2,
      getHeight: 0.5,
      widthMinPixels: 1,
      transitions: {
        getHeight: { duration: 1000, enter: () => [0] },
      },
    }),

    // ── Text layers ───────────────────────────────────────────────────────
    new TextLayer({
      id: 'us-city-labels',
      data: usCities,
      getText: d => d.us_pair.name,
      getPosition: d => [d.us_pair.lng, d.us_pair.lat + 0.06],
      getColor: [226, 232, 240, 180],
      getSize: 11,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 400,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'bottom',
      visible: activeAct >= 8,
    }),
    new TextLayer({
      id: 'port-labels',
      data: ports,
      getText: d => d.name,
      getPosition: d => [d.coordinates[0], d.coordinates[1] + 0.18],
      getColor: [6, 182, 212, 210],
      getSize: 13,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 600,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'bottom',
      visible: activeAct <= 1,
    }),
  ]
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function MapView({ activeAct, hasStarted, onReady, extraLayers = [] }) {
  const [viewState, setViewState]     = useState({ ...TITLE_VIEW_STATE, transitionDuration: 0 })
  const [routeData, setRouteData]     = useState(null)
  const [cityGeoJson, setCityGeoJson] = useState({})
  const [corridorCities, setCorridors]= useState(null)
  const [pulse, setPulse]             = useState(false)
  const [mapLoaded, setMapLoaded]     = useState(false)
  const [dataLoaded, setDataLoaded]   = useState(false)
  const prevHasStartedRef             = useRef(false)

  // ── Data loading ──────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('/data/routes.json').then(r => r.json()),
      fetch('/data/corridors.json').then(r => r.json()),
      ...CITY_BOUNDARY_CONFIG.map(c =>
        fetch(`/data/updated-city-boundaries/${c.id}.geojson`)
          .then(r => r.json())
          .then(data => [c.id, data])
      ),
    ]).then(([routes, corridors, ...boundaryEntries]) => {
      setRouteData(routes)
      setCorridors(corridors)
      setCityGeoJson(Object.fromEntries(boundaryEntries))
      setDataLoaded(true)
    })
  }, [])

  // ── Signal ready when both map tiles and data are loaded ──────
  useEffect(() => {
    if (mapLoaded && dataLoaded) onReady?.()
  }, [mapLoaded, dataLoaded, onReady])

  // ── Pulse animation ───────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 600)
    return () => clearInterval(id)
  }, [])

  // ── View state transitions ─────────────────────────────────────
  useEffect(() => {
    if (!hasStarted) {
      setViewState({ ...TITLE_VIEW_STATE, transitionDuration: 0 })
      return
    }
    // Detect the moment hasStarted flips true — fly from title view with 2s duration
    const comingFromTitle = !prevHasStartedRef.current
    prevHasStartedRef.current = true
    const baseFly    = ACT_CONFIG[activeAct]?.flyDuration ?? 3500
    const flyDuration = comingFromTitle && activeAct === 0 ? 2000 : baseFly
    setViewState({
      ...VIEW_STATES[activeAct],
      transitionDuration:   flyDuration,
      transitionInterpolator: flyDuration > 0
        ? new FlyToInterpolator({ speed: flyDuration >= 5000 ? 0.4 : 0.8 })
        : null,
    })
  }, [activeAct, hasStarted])

  const layers = [
    ...getLayers(activeAct, routeData, cityGeoJson, corridorCities, pulse),
    ...extraLayers,
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        controller={true}
        layers={layers}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          reuseMaps
          onLoad={() => setMapLoaded(true)}
        />
      </DeckGL>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,14,23,0.6) 100%)',
      }} />

      {/* Top-left watermark */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 20, pointerEvents: 'none' }}>
        <p style={{
          color: '#e2e8f0', fontFamily: '"DM Sans", sans-serif', fontWeight: 700,
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0, lineHeight: 1,
        }}>
          Fentanyl Corridors
        </p>
        <p style={{
          color: '#475569', fontFamily: '"DM Sans", sans-serif', fontWeight: 400,
          fontSize: 10, letterSpacing: '0.04em', margin: '5px 0 0', lineHeight: 1,
        }}>
          Criminal Governance &amp; Cross-Border Drug Markets
        </p>
      </div>

      {/* Top-right act indicator */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 20, pointerEvents: 'none', textAlign: 'right' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAct}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p style={{
              color: '#F97316', fontFamily: MONO,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: 0, lineHeight: 1,
            }}>
              Act {activeAct}
            </p>
            <p style={{
              color: '#e2e8f0', fontFamily: '"DM Sans", sans-serif',
              fontSize: 12, margin: '4px 0 0', letterSpacing: '0.03em', lineHeight: 1,
            }}>
              {ACT_CONFIG[activeAct]?.title}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
