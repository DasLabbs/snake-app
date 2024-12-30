/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      ss: '410px',
      md: '640px',
    },
    extend: {},
    fontFamily: {
      cubic: ['cubic', 'sans-serif'],
      pixel: ['pixel', 'sans-serif'],
    },
  },
  plugins: [],
};
