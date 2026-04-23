export default {
  acts: [
    { title: 'El Origen',          subtitle: 'Puertos del Pacífico'   },
    { title: 'La Producción',      subtitle: 'Sinaloa'                },
    { title: 'Hermosillo',         subtitle: 'Sonora'                 },
    { title: 'Nogales',            subtitle: 'Sonora'                 },
    { title: 'Mexicali',           subtitle: 'Baja California'        },
    { title: 'Tijuana',            subtitle: 'Baja California'        },
    { title: 'La Ruta Oriental',   subtitle: 'De vuelta a Sinaloa'    },
    { title: 'Ciudad Juárez',      subtitle: 'Chihuahua'              },
    { title: 'El Cruce',           subtitle: 'La Frontera'            },
    { title: 'La Crisis',          subtitle: 'Ambos Lados'            },
  ],

  titleCard: {
    label:      'InSight Crime',
    title:      'Corredores de Fentanilo',
    subtitle:   'Cómo la gobernanza criminal moldea los mercados de drogas en el norte de México',
    supplement: 'Visualización complementaria de "Reglas locales, lecciones globales" (marzo de 2026)',
    cta:        'PRESIONA PLAY O ESPACIO PARA COMENZAR',
  },

  endCard: {
    label:   'Fin de la Presentación',
    title:   'Corredores de Fentanilo',
    sources: 'Fuentes: InSight Crime, CBP, CDC, INEGI, SISVEA, SEDENA',
    builder: 'Elaborado por Luke C. — Case Western Reserve University',
    report:  'Informe completo: insightcrime.org',
    replay:  '↺ Repetir',
  },

  controlBar: {
    presentationComplete: 'Presentación completa',
    actLabel: (act, title) => `Acto ${act}: ${title}`,
    aria: {
      prev:   'Acto anterior',
      next:   'Siguiente acto',
      replay: 'Repetir',
      pause:  'Pausar',
      play:   'Reproducir',
    },
  },

  autoPlay: {
    projectLabel:    'Corredores de Fentanilo',
    desktopRequired: 'Se requiere escritorio',
    desktopMessage:  'Esta visualización está diseñada para escritorio. Por favor, ábrela en una pantalla más grande para una mejor experiencia.',
    loading:         'Cargando corredores...',
  },

  mapLegend: {
    heading: 'Tipo de Gobernanza Criminal',
    items: [
      { label: 'Monopolio',      city: 'Mexicali'   },
      { label: 'Oligopolio',     city: 'Tijuana'    },
      { label: 'Duopolio',       city: 'Nogales'    },
      { label: 'Tregua Frágil',  city: 'Hermosillo' },
      { label: 'Prohibición',    city: 'Juárez'     },
    ],
    arcNote: 'Ancho de arco ∝ participación en decomisos CBP',
  },

  portsCard: {
    heading:     'Puertos del Pacífico',
    subheading:  'El Punto de Entrada',
    body:        'Precursores químicos chinos llegan a los puertos del Pacífico de México, principalmente',
    portA:       'Lázaro Cárdenas (Michoacán)',
    portB:       'Manzanillo (Colima)',
    bodyEnd:     ', en contenedores de carga comercial.',
    keyLabel:    'Sustancias clave: ',
    substances:  '4-AP, 1-Boc-4-Piperidona, ANPP. Primer decomiso mexicano de (2-Bromoetil)Benceno:',
    seizureDate: 'noviembre de 2024.',
    source:      'Fuente: DEA, CRS, InSight Crime',
  },

  productionCard: {
    subheading:  'El Laboratorio',
    body:        'A finales de los años 2010, las redes criminales, principalmente con base en Sinaloa, se convirtieron en los principales productores de fentanilo ilícito, estableciendo operaciones paralelas de producción y exportación.',
    seizedLabel: 'decomisado',
    callout:     'Dic 2024: El mayor decomiso en la historia de México:',
    calloutHigh: '20 millones de pastillas',
    calloutEnd:  'en Sinaloa.',
  },

  easternRouteCard: {
    heading:     'La Ruta Oriental',
    subheading:  'Culiacán → Chihuahua → El Paso',
    body:        'Un segundo corredor de suministro sale hacia el este de Sinaloa, cruzando la Sierra Tarahumara hacia Chihuahua. Los Chapitos controlan el suministro y el tránsito; La Línea controla el destino, y prohíbe estrictamente las ventas locales de fentanilo.',
    supplyLabel: 'suministro y tránsito',
    destLabel:   'control del destino',
    callout:     'Uno de los corredores de droga más transitados del mundo,',
    calloutHigh: 'sin embargo el fentanilo está prohibido',
    calloutEnd:  'en el mercado local. Venderlo indica vínculos con rivales de Sinaloa.',
  },

  borderCard: {
    statDesc:   'del fentanilo producido cruza hacia Estados Unidos',
    localNote:  'Solo ~10% permanece en los mercados locales de México',
    chartLabel: 'Participación de Decomisos CBP por Corredor, AF2025',
    footer:     'AF2025:',
    footerStat: '11,486 libras decomisadas en la frontera',
    footerEnd:  ', 46% menos que en 2024',
  },

  crisisCard: {
    statDesc:   'Muertes por opioides sintéticos en EE.UU. en 2024',
    highImpact: '⚡ ALTO IMPACTO',
    heading:    'Pero en México, la crisis sigue siendo invisible',
    points: [
      'La mayoría de los hospitales carecen de equipos para detectar fentanilo',
      'La escasez de metadona cerró clínicas en 3 de las 5 ciudades estudiadas',
      "La naloxona está clasificada como 'psicotrópico', solo disponible en hospitales",
      'La buprenorfina no puede recetarse para la adicción a opioides',
      'Las organizaciones de reducción de daños se financian casi en su totalidad con donantes extranjeros',
    ],
    footer: 'Es probable que las comunidades fronterizas de México sigan las tendencias de EE.UU. La pregunta es si las instituciones estarán preparadas.',
  },

  cityCard: {
    territory:       'Territorio',
    regulationStyle: 'Estilo de Regulación',
    forms:           'Formas',
    pricePerDose:    'Precio por Dosis',
    doseLabel:       'dosis',
    healthToll:      'Impacto en la Salud',
    regulation: {
      monopoly:      'Monopolio Criminal',
      oligopoly:     'Oligopolio Criminal',
      duopoly:       'Duopolio Criminal',
      fragile_truce: 'Tregua Frágil',
      prohibition:   'Prohibición Total',
    },
  },

  mapTooltip: {
    localMarket:    'Mercado Local',
    pricePerDose:   'Precio / dosis',
    healthImpact:   'Impacto en salud',
    cbpSeizures:    'Decomisos CBP',
    ofAllSeized:    'del fentanilo decomisado en EE.UU.',
    dataLimited:    'Datos limitados',
    statusLabels: {
      integrated: 'INTEGRADO',
      restricted:  'RESTRINGIDO',
      sporadic:    'ESPORÁDICO',
    },
  },

  cityData: {
    mexicali: {
      groups:           ['Los Rusos (facción del Cártel de Sinaloa)'],
      formats:          ['Principalmente fentanilo mezclado con heroína black tar', 'Pastillas en gran medida prohibidas'],
      overdose_display: '5+ sobredosis/semana',
    },
    tijuana: {
      groups:           ['Los Chapitos (Cártel de Sinaloa)', 'Facción Mayiza (Cártel de Sinaloa)', 'CJNG', 'Cártel Arellano Félix (CAF)'],
      formats:          ['Polvo blanco (forma principal)', 'Mezclado con heroína', 'Pastillas M30 falsificadas', 'Otras variaciones en polvo'],
      overdose_display: '~3 sobredosis/día',
    },
    hermosillo: {
      groups:           ['Los Salazar', 'Los Chapitos'],
      formats:          ['Fentanilo en polvo', 'Pastillas M30 falsificadas', "Heroína mezclada con fentanilo (estilo 'China White')"],
      overdose_display: '2–3 emergencias/mes',
    },
    nogales: {
      groups:           ['Los Salazar (lado oeste)', 'Facciones del Cártel de Sinaloa — Chapitos / Mayiza (lado este)'],
      formats:          ['Pastillas M30 falsificadas (fumadas)', 'Algo de fentanilo en polvo'],
      overdose_display: '6–9 emergencias/semana',
    },
    juarez: {
      groups:           ['La Línea / La Empresa (facciones del Cártel de Juárez)', 'Barrio Azteca', 'Mexicos / Artistas Asesinos (vinculados a Sinaloa)'],
      formats:          ['Poco frecuente: pastillas', 'Ocasionalmente mezclado con heroína'],
      overdose_display: 'Esporádico — 5 muertes por cocaína adulterada (mayo 2025)',
    },
  },
}
