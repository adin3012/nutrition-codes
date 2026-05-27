/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#102f65',
        'primary-container': '#2b467d',
        'on-primary': '#ffffff',
        'on-primary-container': '#9cb5f4',
        secondary: '#4173F4',
        'on-secondary': '#ffffff',
        accent: '#40F39A',
        'on-surface': '#0b1b36',
        'on-surface-variant': '#444650',
        'surface-low': '#f1f3ff',
        'surface-mid': '#e8eeff',
        'surface-high': '#e0e8ff',
        'surface-highest': '#d7e2ff',
        'outline-variant': '#c4c6d1',
        background: '#f9f9ff',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
