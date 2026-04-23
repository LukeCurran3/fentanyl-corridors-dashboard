/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: '#0a0e17',
        surface: '#111827',
        border: '#1e293b',
        'text-primary': '#e2e8f0',
        'text-secondary': '#94a3b8',
        accent: '#f97316',
        'gov-monopoly': '#EF4444',
        'gov-oligopoly': '#F97316',
        'gov-duopoly': '#EAB308',
        'gov-truce': '#14B8A6',
        'gov-prohibition': '#3B82F6',
      },
    },
  },
  plugins: [],
}
