/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#8dc9ab',
          200: '#00a678',
          300: '#009c6d',
          400: '#00925b',
          500: '#007348',
        }
      }
    },
  },
  plugins: [],
};