/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#F9F5F6',
          100: '#F4ECEE',
          200: '#E7D5D9',
          300: '#D5B3BC',
          400: '#BF8898',
          500: '#A45D73',
          600: '#8A4156',
          700: '#682038',
          800: '#54192D',
          900: '#461726',
        },
        cream: {
          50: '#FDFAF6',
          100: '#FAF7F2',
          200: '#F4ECE2',
          300: '#EBE0D2',
        },
        bronze: {
          500: '#8B5E3C',
          600: '#754E32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
