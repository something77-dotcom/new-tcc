/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          50: '#f2f9f4',
          100: '#e3f2e8',
          200: '#c4e4cc',
          300: '#95cfa4',
          400: '#5eb275',
          500: '#389155',
          600: '#267341',
          700: '#1e5b34',
          800: '#1a492b',
          900: '#163c24',
          950: '#0a2114',
        },
      },
    },
  },
  plugins: [],
}
