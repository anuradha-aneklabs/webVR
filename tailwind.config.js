/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#060a08',
          900: '#0b120e',
          850: '#0f1712',
          800: '#14211a',
          700: '#1e3328',
          600: '#2b4738',
        },
        brand: {
          green: '#28e070',
          'green-light': '#34f480',
          'green-dark': '#1cb859',
          accent: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glow': '0 0 25px rgba(40, 224, 112, 0.35)',
      }
    },
  },
  plugins: [],
}

