/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./works.html",
    "./goals.html",
    "./thinking_out_loud/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'site-black': '#080810',
        'surface':    '#0f0f18',
        'surface-2':  '#13131e',
        'accent':     '#3b82f6',
      },
      fontFamily: {
        'mono': ['Space Mono', 'monospace'],
        'body': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeUp 0.7s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
