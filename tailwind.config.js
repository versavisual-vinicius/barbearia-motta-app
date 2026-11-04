/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F7EF',
          100: '#E6F1E5',
          600: '#1A6B3A',
          700: '#15552D',
          800: '#123D26',
          900: '#0B2C1C',
          950: '#071E13',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

