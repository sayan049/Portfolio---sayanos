import type { Config } from 'tailwindcss'

const config: Config = {
content: [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
],
  theme: {
    extend: {
      colors: {
        'os-bg':        '#09090C',
        'os-bg-2':      '#0D0D11',
        'os-surface':   '#141418',
        'os-surface-2': '#1A1A21',
        'os-surface-3': '#202028',
        'os-border':    '#2C2C38',
        'os-border-l':  '#38384A',
        'os-cyan':      '#4FC3F7',
        'os-blue':      '#818CF8',
        'os-green':     '#34D399',
        'os-amber':     '#FBBF24',
        'os-red':       '#F87171',
        'os-text':      '#EDEDF5',
        'os-text-2':    '#9898B0',
        'os-text-3':    '#56566E',
        'os-text-4':    '#303045',
      },
      fontFamily: {
        sans: ['var(--font-lexend-deca)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
        geist: ['var(--font-lexend-deca)', 'sans-serif'], // Fallback for any old usage
      },
      borderRadius: {
        window: '12px',
        panel:  '10px',
        input:  '7px',
        badge:  '5px',
      },
      boxShadow: {
        window: '0 0 0 0.5px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.45), 0 16px 48px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.3)',
        dock:   '0 0 0 0.5px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.5), 0 16px 40px rgba(0,0,0,0.4)',
        card:   '0 0 0 0.5px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.35)',
        float:  '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-slow':     'pulseDot 2.5s ease-in-out infinite',
        'cursor-blink':   'cursorBlink 1s step-end infinite',
        'gradient-shift': 'gradientShift 20s ease-in-out infinite',
        'pulse-ring':     'pulseRing 2.5s ease-out infinite',
        'spin-slow':      'spin 8s linear infinite',
      },
      keyframes: {
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%':      { backgroundPosition: '100% 100%' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config