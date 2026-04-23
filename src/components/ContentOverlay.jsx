import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CityCard from './CityCard'
import PortsCard from './PortsCard'
import ProductionCard from './ProductionCard'
import EasternRouteCard from './EasternRouteCard'
import BorderCard from './BorderCard'
import CrisisCard from './CrisisCard'

// Maps act number → city id in corridors.json
const ACT_TO_CITY_ID = { 2: 'hermosillo', 3: 'nogales', 4: 'mexicali', 5: 'tijuana', 7: 'juarez' }

function getPositionStyle(cardPosition) {
  switch (cardPosition) {
    case 'top-right':
      return { position: 'absolute', top: 32, right: 32 }
    case 'right':
      return { position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)' }
    case 'left':
      // Slightly above center to balance against the control bar
      return { position: 'absolute', left: 32, top: '44%', transform: 'translateY(-50%)' }
    case 'center':
      return { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    case 'center-left':
      return { position: 'absolute', left: 48, top: '44%', transform: 'translateY(-50%)' }
    default:
      return { position: 'absolute', top: 32, right: 32 }
  }
}

export default function ContentOverlay({ activeAct, currentActConfig }) {
  const [corridors, setCorridors] = useState(null)

  useEffect(() => {
    fetch('/data/corridors.json')
      .then((r) => r.json())
      .then(setCorridors)
      .catch(console.error)
  }, [])

  if (!corridors) return null

  const cityId = ACT_TO_CITY_ID[activeAct]
  let card = null

  if (cityId) {
    const cityData = corridors.find((c) => c.id === cityId)
    card = cityData ? <CityCard cityData={cityData} /> : null
  } else {
    switch (activeAct) {
      case 0:
        card = <PortsCard />
        break
      case 1:
        card = <ProductionCard />
        break
      case 6:
        card = <EasternRouteCard />
        break
      case 8:
        card = <BorderCard />
        break
      case 9:
        card = <CrisisCard />
        break
      default:
        card = null
    }
  }

  if (!card) return null

  const cardPosition = currentActConfig?.cardPosition ?? 'top-right'
  const posStyle = getPositionStyle(cardPosition)

  return (
    <div style={{ ...posStyle, zIndex: 10, pointerEvents: 'auto' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`act-${activeAct}`}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ overflow: 'visible' }}
        >
          {card}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
