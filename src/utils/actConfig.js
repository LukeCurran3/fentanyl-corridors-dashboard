import t from './actConfigI18n'

// flyDuration: how long the camera fly-to animation takes when arriving at this act (ms)
export const ACT_CONFIG = [
  { id: 0, ...t[0], duration: 10,  cardPosition: "top-right",   flyDuration: 0    },
  { id: 1, ...t[1], duration: 12,  cardPosition: "right",       flyDuration: 3500 },
  { id: 2, ...t[2], duration: 12,  cardPosition: "left",        flyDuration: 3500 },
  { id: 3, ...t[3], duration: 12,  cardPosition: "left",        flyDuration: 3500 },
  { id: 4, ...t[4], duration: 12,  cardPosition: "left",        flyDuration: 3500 },
  { id: 5, ...t[5], duration: 12,  cardPosition: "left",        flyDuration: 3500 },
  { id: 6, ...t[6], duration: 11,  cardPosition: "right",       flyDuration: 3500 },
  { id: 7, ...t[7], duration: 12,  cardPosition: "left",        flyDuration: 7000 },
  { id: 8, ...t[8], duration: 5,   cardPosition: "center",      flyDuration: 3500 },
  { id: 9, ...t[9], duration: 15,  cardPosition: "right",       flyDuration: 3500 },
]

export const TOTAL_DURATION = ACT_CONFIG.reduce((sum, act) => sum + act.duration, 0)
