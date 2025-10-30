// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'hd-yellow': '#FFD247', // approx yellow used in design
      },
      borderRadius: {
        '2xl': '1rem',
      }
    }
  },
  plugins: [],
};
