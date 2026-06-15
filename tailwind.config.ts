import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',   // naranja principal CCTA
          600: '#ea6a10',
          700: '#c2530a',
          800: '#9a3d07',
          900: '#7c3205',
        },
        accent: {
          green:  '#10b981',
          orange: '#f97316',
          pink:   '#ec4899',
          blue:   '#3b82f6',
        },
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        brand:       '0 4px 24px rgba(249,115,22,0.30)',
        'card':      '0 2px 16px rgba(0,0,0,0.07)',
        'card-hover':'0 8px 32px rgba(0,0,0,0.13)',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-in-out',
        'slide-up':  'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':  'scaleIn 0.2s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeIn:   { from:{opacity:'0'},              to:{opacity:'1'} },
        slideUp:  { from:{transform:'translateY(20px)',opacity:'0'}, to:{transform:'translateY(0)',opacity:'1'} },
        scaleIn:  { from:{transform:'scale(0.95)',opacity:'0'},       to:{transform:'scale(1)',opacity:'1'} },
        pulseDot: { '0%,100%':{boxShadow:'0 0 0 0 rgba(249,115,22,0.4)'}, '50%':{boxShadow:'0 0 0 8px rgba(249,115,22,0)'} },
      },
    },
  },
  plugins: [],
}
export default config
