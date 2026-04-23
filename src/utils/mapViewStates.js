export const VIEW_STATES = {
  // Act 0 — Pacific ports (Michoacán / Jalisco coast)
  0: { longitude: -103.5,  latitude: 19.0,  zoom: 6.5, pitch: 40, bearing: -15 },
  // Act 1 — Culiacán / Sinaloa production hub
  1: { longitude: -107.4,  latitude: 24.8,  zoom: 7,   pitch: 35, bearing: 0   },
  // Act 2 — Hermosillo (first stop, western corridor begins)
  2: { longitude: -110.96, latitude: 29.07, zoom: 9,   pitch: 45, bearing: 0   },
  // Act 3 — Nogales (Sonora / Arizona border)
  3: { longitude: -110.95, latitude: 31.33, zoom: 9,   pitch: 45, bearing: 0   },
  // Act 4 — Mexicali (Baja California / Calexico)
  4: { longitude: -115.45, latitude: 32.62, zoom: 9,   pitch: 45, bearing: 0   },
  // Act 5 — Tijuana (western terminus, San Diego crossing)
  5: { longitude: -117.04, latitude: 32.51, zoom: 9,   pitch: 45, bearing: 0   },
  // Act 6 — Return to Sinaloa before eastern route; slight bearing shift for fresh perspective
  6: { longitude: -107.4,  latitude: 24.8,  zoom: 6.5, pitch: 35, bearing: 20  },
  // Act 7 — Ciudad Juárez (slow fly across the Sierra Madre from Sinaloa)
  7: { longitude: -106.42, latitude: 31.69, zoom: 9,   pitch: 45, bearing: 0   },
  // Act 8 — Wide border pullback (full US–Mexico border visible)
  8: { longitude: -112,    latitude: 32,    zoom: 5.5, pitch: 30, bearing: 0   },
  // Act 9 — Crisis view: centered on Mexico with US border in upper frame
  9: { longitude: -103,    latitude: 26,    zoom: 4.2, pitch: 20, bearing: 0   },
}
