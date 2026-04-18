import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#0f0f0f',
        'surface-2': '#161616',
        border: '#1e1e1e',
        'border-light': '#2a2a2a',
        'text-primary': '#f0ede8',
        'text-secondary': '#6b6b6b',
        'text-tertiary': '#404040',
        accent: '#c4a35a',
        'accent-dim': 'rgba(196, 163, 90, 0.12)',
        'accent-border': 'rgba(196, 163, 90, 0.3)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
