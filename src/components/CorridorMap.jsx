import { useState, useEffect } from 'react'
import { Map } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer, ArcLayer, TextLayer } from '@deck.gl/layers'
import 'mapbox-gl/dist/mapbox-gl.css'

import MapLegend from './MapLegend'
import MapTooltip from './MapTooltip'
import { hexToRgb } from '../utils/colors'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const INITIAL_VIEW = {
  longitude: -112.5,
  latitude:   31.5,
  zoom:        5.5,
  pitch:      35,
  bearing:     0,
}

const CBP_WIDTH = {
  'San Diego':  8,
  'Tucson':     7,
  'El Centro':  2.5,
  'El Paso':    1.5,
}

const STATUS_RADIUS = {
  integrated: 22000,
  restricted:  15000,
  sporadic:    10000,
}

export default function CorridorMap() {
  const [corridors, setCorridors] = useState([])
  const [viewState, setViewState] = useState(INITIAL_VIEW)
  const [hoverInfo, setHoverInfo] = useState(null)
  // Controls entrance animation; flipped to true shortly after data loads
  const [entered,   setEntered]   = useState(false)

  useEffect(() => {
    fetch('/data/corridors.json')
      .then(r => r.json())
      .then(data => {
        setCorridors(data)
        // Brief delay so the first render with height=0/alpha=0 completes
        // before we animate to the final values
        setTimeout(() => setEntered(true), 180)
      })
  }, [])

  const withPair = corridors.filter(c => c.us_pair)

  const layers = [
    // ── Arcs: grow from flat (height=0) to curved (height=0.5) ────
    new ArcLayer({
      id: 'corridor-arcs',
      data: withPair,
      getSourcePosition: d => [d.lng, d.lat],
      getTargetPosition: d => [d.us_pair.lng, d.us_pair.lat],
      getSourceColor:    d => [...hexToRgb(d.governance.color), entered ? 210 : 0],
      getTargetColor:    entered ? [210, 225, 240, 100] : [210, 225, 240, 0],
      getWidth:          d => CBP_WIDTH[d.us_pair.cbp_field_office] ?? 2,
      getHeight:         entered ? 0.5 : 0,
      widthUnits:        'pixels',
      transitions: {
        getHeight:      { duration: 1600 },
        getSourceColor: { duration: 1200 },
        getTargetColor: { duration: 1200 },
      },
    }),

    // ── U.S. cities: fade in ──────────────────────────────────────
    new ScatterplotLayer({
      id: 'us-cities',
      data: withPair,
      getPosition:  d => [d.us_pair.lng, d.us_pair.lat],
      getRadius:    entered ? 9000 : 0,
      getFillColor: entered ? [185, 205, 225, 170] : [185, 205, 225, 0],
      getLineColor: entered ? [255, 255, 255, 35]  : [255, 255, 255, 0],
      lineWidthMinPixels: 1,
      stroked: true,
      filled:  true,
      transitions: {
        getRadius:    { duration: 900 },
        getFillColor: { duration: 900 },
      },
    }),

    // ── MX cities: bubble up from zero radius ────────────────────
    new ScatterplotLayer({
      id: 'mx-cities',
      data: corridors,
      getPosition:  d => [d.lng, d.lat],
      getRadius:    d => entered ? (STATUS_RADIUS[d.fentanyl_market.status] ?? 14000) : 0,
      getFillColor: d => [...hexToRgb(d.governance.color), entered ? 225 : 0],
      getLineColor: entered ? [255, 255, 255, 55] : [255, 255, 255, 0],
      lineWidthMinPixels: 1,
      stroked:  true,
      filled:   true,
      pickable: true,
      onHover:  info => setHoverInfo(info.object ? info : null),
      autoHighlight: true,
      highlightColor: [255, 255, 255, 40],
      transitions: {
        getRadius:    { duration: 1100 },
        getFillColor: { duration: 1100 },
      },
    }),

    // ── U.S. labels ───────────────────────────────────────────────
    new TextLayer({
      id: 'us-labels',
      data: withPair,
      getPosition:          d => [d.us_pair.lng, d.us_pair.lat],
      getText:              d => d.us_pair.name,
      getSize:              11,
      getColor:             [148, 163, 184, 195],
      getPixelOffset:       [0, -16],
      fontFamily:           '"DM Sans", sans-serif',
      fontWeight:           '500',
      getTextAnchor:        'middle',
      getAlignmentBaseline: 'bottom',
    }),

    // ── MX labels ────────────────────────────────────────────────
    new TextLayer({
      id: 'mx-labels',
      data: corridors,
      getPosition:          d => [d.lng, d.lat],
      getText:              d => d.name,
      getSize:              13,
      getColor:             [226, 232, 240, 255],
      getPixelOffset:       [0, -26],
      fontFamily:           '"DM Sans", sans-serif',
      fontWeight:           '700',
      getTextAnchor:        'middle',
      getAlignmentBaseline: 'bottom',
    }),
  ]

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Loading state */}
      {corridors.length === 0 && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        </div>
      )}

      <DeckGL
        viewState={viewState}
        controller={{ scrollZoom: true, dragPan: true, dragRotate: true, doubleClickZoom: true }}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        layers={layers}
        style={{ position: 'absolute', inset: 0 }}
        getCursor={({ isDragging, isHovering }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'
        }
      >
        <Map
          mapboxAccessToken={TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          reuseMaps
        />
      </DeckGL>

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          top: '72px',
          left: '24px',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <h2
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(13px, 1.4vw, 17px)',
            color: '#e2e8f0',
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
            marginBottom: '4px',
            letterSpacing: '-0.01em',
          }}
        >
          Fentanyl Corridors: Criminal Governance &amp; Cross-Border Flows
        </h2>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 'clamp(10px, 0.95vw, 12px)',
            color: '#94a3b8',
            textShadow: '0 1px 4px rgba(0,0,0,0.9)',
          }}
        >
          How criminal groups shape local drug markets in northern Mexico
        </p>
      </div>

      <MapLegend />

      {hoverInfo && (
        <MapTooltip city={hoverInfo.object} x={hoverInfo.x} y={hoverInfo.y} />
      )}
    </div>
  )
}
