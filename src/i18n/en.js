export default {
  acts: [
    { title: 'The Origin',        subtitle: 'Pacific Ports'    },
    { title: 'The Production',    subtitle: 'Sinaloa'          },
    { title: 'Hermosillo',        subtitle: 'Sonora'           },
    { title: 'Nogales',           subtitle: 'Sonora'           },
    { title: 'Mexicali',          subtitle: 'Baja California'  },
    { title: 'Tijuana',           subtitle: 'Baja California'  },
    { title: 'The Eastern Route', subtitle: 'Back to Sinaloa'  },
    { title: 'Ciudad Juárez',     subtitle: 'Chihuahua'        },
    { title: 'The Crossing',      subtitle: 'The Border'       },
    { title: 'The Crisis',        subtitle: 'Both Sides'       },
  ],

  titleCard: {
    label:      'InSight Crime',
    title:      'Fentanyl Corridors',
    subtitle:   'How Criminal Governance Shapes Drug Markets in Northern Mexico',
    supplement: 'Supplementary visualization for "Reglas locales, lecciones globales" (March 2026)',
    cta:        'PRESS PLAY OR SPACE TO BEGIN',
  },

  endCard: {
    label:   'End of Presentation',
    title:   'Fentanyl Corridors',
    sources: 'Sources: InSight Crime, CBP, CDC, INEGI, SISVEA, SEDENA',
    builder: 'Built by Luke C. — Case Western Reserve University',
    report:  'Full report: insightcrime.org',
    replay:  '↺ Replay',
  },

  controlBar: {
    presentationComplete: 'Presentation complete',
    actLabel: (act, title) => `Act ${act}: ${title}`,
    aria: {
      prev:   'Previous act',
      next:   'Next act',
      replay: 'Replay',
      pause:  'Pause',
      play:   'Play',
    },
  },

  autoPlay: {
    projectLabel: 'Fentanyl Corridors',
    desktopRequired: 'Desktop required',
    desktopMessage:  'This visualization is designed for desktop. Please view on a wider screen for the best experience.',
    loading:         'Loading corridors...',
  },

  mapLegend: {
    heading:  'Criminal Governance Type',
    items: [
      { label: 'Monopoly',      city: 'Mexicali'   },
      { label: 'Oligopoly',     city: 'Tijuana'    },
      { label: 'Duopoly',       city: 'Nogales'    },
      { label: 'Fragile Truce', city: 'Hermosillo' },
      { label: 'Prohibition',   city: 'Juárez'     },
    ],
    arcNote: 'Arc width ∝ CBP seizure share',
  },

  portsCard: {
    heading:    'Pacific Ports',
    subheading: 'The Entry Point',
    body:       "Chinese precursor chemicals arrive at Mexico's Pacific ports, primarily",
    portA:      'Lázaro Cárdenas (Michoacán)',
    portB:      'Manzanillo (Colima)',
    bodyEnd:    ', in commercial shipping containers.',
    keyLabel:   'Key substances: ',
    substances: '4-AP, 1-Boc-4-Piperidone, ANPP. First Mexican seizure of (2-Bromoethyl)Benzene:',
    seizureDate: 'November 2024.',
    source:     'Source: DEA, CRS, InSight Crime',
  },

  productionCard: {
    subheading:  'The Lab',
    body:        'By the late 2010s, criminal networks, primarily based in Sinaloa, became the main producers of illicit fentanyl, establishing parallel production and export operations.',
    seizedLabel: 'seized',
    callout:     'Dec 2024: Largest seizure in Mexican history:',
    calloutHigh: '20 million pills',
    calloutEnd:  'in Sinaloa.',
  },

  easternRouteCard: {
    heading:     'The Eastern Route',
    subheading:  'Culiacán → Chihuahua → El Paso',
    body:        'A second supply corridor runs east out of Sinaloa, crossing the Sierra Tarahumara into Chihuahua. Los Chapitos control the supply and transit; La Línea holds the destination, and strictly bans local fentanyl sales.',
    supplyLabel: 'supply & transit',
    destLabel:   'destination control',
    callout:     "One of the world's busiest drug corridors,",
    calloutHigh: 'yet fentanyl is banned',
    calloutEnd:  'in the local market. Selling it signals ties to Sinaloa rivals.',
  },

  borderCard: {
    statDesc:   'of fentanyl produced crosses into the United States',
    localNote:  "Only ~10% stays in Mexico's local markets",
    chartLabel: 'CBP Seizure Share by Corridor, FY2025',
    footer:     'FY2025:',
    footerStat: '11,486 lbs seized at the border',
    footerEnd:  ', down 46% from 2024',
  },

  crisisCard: {
    statDesc:  'U.S. synthetic opioid deaths in 2024',
    highImpact: '⚡ HIGH IMPACT',
    heading:   'But in Mexico, the crisis remains invisible',
    points: [
      'Most hospitals lack fentanyl testing equipment',
      'Methadone shortage closed clinics in 3 of 5 cities studied',
      "Naloxone classified as 'psychotropic', hospitals only",
      'Buprenorphine cannot be prescribed for opioid addiction',
      'Harm reduction orgs funded almost entirely by foreign donors',
    ],
    footer: "Mexico's border communities are likely to follow U.S. trends. The question is whether institutions will be ready.",
  },

  cityCard: {
    territory:      'Territory',
    regulationStyle:'Regulation Style',
    forms:          'Forms',
    pricePerDose:   'Price per Dose',
    healthToll:     'Health Toll',
    regulation: {
      monopoly:      'Criminal Monopoly',
      oligopoly:     'Criminal Oligopoly',
      duopoly:       'Criminal Duopoly',
      fragile_truce: 'Fragile Truce',
      prohibition:   'Total Prohibition',
    },
  },

  mapTooltip: {
    localMarket:    'Local Market',
    pricePerDose:   'Price / dose',
    healthImpact:   'Health impact',
    cbpSeizures:    'CBP Seizures',
    ofAllSeized:    'of all U.S. fentanyl seized',
    dataLimited:    'Data limited',
    statusLabels: {
      integrated: 'INTEGRATED',
      restricted:  'RESTRICTED',
      sporadic:    'SPORADIC',
    },
  },

  cityData: {
    mexicali: {
      formats:          ['Primarily fentanyl mixed with black tar heroin', 'Pills largely prohibited'],
      overdose_display: '5+ overdoses/week',
    },
    tijuana: {
      formats:          ['White powder (main form)', 'Mixed with heroin', 'Counterfeit M30 pills', 'Other powder variations'],
      overdose_display: '~3 overdoses/day',
    },
    hermosillo: {
      formats:          ['Powder fentanyl', 'Counterfeit M30 pills', "Heroin mixed with fentanyl ('China White' style)"],
      overdose_display: '2–3 emergencies/month',
    },
    nogales: {
      formats:          ['Counterfeit M30 pills (smoked)', 'Some powdered fentanyl'],
      overdose_display: '6–9 emergencies/week',
    },
    juarez: {
      formats:          ['Rare: pills', 'Occasionally mixed with heroin'],
      overdose_display: 'Sporadic — 5 deaths from laced cocaine (May 2025)',
    },
  },
}
