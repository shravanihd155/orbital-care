import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        habitat: {
          ground: '#F5F2EB',          // Warm Lunar Cream
          panel: '#FCFAF6',           // Pale Regolith
          elevated: '#ECE7DC',        // Dusted Sand
          graphite: '#16181C',        // Deep Carbon Graphite
          cardDark: '#22252C',        // Modular Graphite Card
          border: 'rgba(23, 24, 29, 0.14)',
          borderDark: 'rgba(255, 255, 255, 0.12)',
        },
        spaceText: {
          primary: '#17181D',         // Carbon Black
          secondary: '#585E6D',       // Graphite Slate
          muted: '#8A91A0',           // Dust Muted
          inverse: '#F7F5F0',         // Lunar White
        },
        mission: {
          orange: '#E65100',          // Mission Ascent Orange
          orangeSubtle: '#FFF3EB',
          lime: '#689F00',            // Orbital Velocity Lime
          limeSubtle: '#F1F8E9',
          violet: '#665584',          // Sleep Actigraphy Violet
          violetSubtle: '#F3EFF9',
        },
      },
      fontFamily: {
        mono: ['Space Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        instrument: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'instrument-dark': '0 2px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
