// Criminal governance type colors
export const GOVERNANCE_COLORS = {
  monopoly:    '#EF4444',  // Mexicali  — red
  oligopoly:   '#F97316',  // Tijuana   — orange
  duopoly:     '#EAB308',  // Nogales   — yellow
  truce:       '#14B8A6',  // Hermosillo — teal
  prohibition: '#3B82F6',  // Juárez    — blue
}

// Timeline event category colors
export const CATEGORY_COLORS = {
  supply:             '#F97316',  // orange
  market_introduction:'#EF4444',  // red
  health:             '#EC4899',  // pink
  disruption:         '#EAB308',  // yellow
  policy:             '#3B82F6',  // blue
  market_evolution:   '#14B8A6',  // teal
  market_expansion:   '#06B6D4',  // cyan
  outcome:            '#22C55E',  // green
}

// App palette
export const PALETTE = {
  bg:            '#0a0e17',
  surface:       '#111827',
  border:        '#1e293b',
  textPrimary:   '#e2e8f0',
  textSecondary: '#94a3b8',
  accent:        '#f97316',
}

// Helper: hex → [r, g, b] for deck.gl
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 255, 255]
}
