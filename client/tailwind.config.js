/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olx: {
          teal: '#002f34',
          'teal-hover': '#044a52',
          yellow: '#ffce32',
          'yellow-hover': '#f0be20',
          bg: '#f2f4f5',
          border: '#e8e8e8',
          text: '#3a3a3a',
          muted: '#8a8a8a',
          featured: '#ffce32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
