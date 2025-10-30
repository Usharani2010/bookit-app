/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'hd-yellow': '#FFD247',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    }
  },
  plugins: [],
}