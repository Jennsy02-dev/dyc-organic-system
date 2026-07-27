/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        organic: {
          green: '#2e7d32',
          lightGreen: '#e8f5e9',
          gold: '#d4af37',
          dark: '#1b4332',
        },
      },
    },
  },
  plugins: [],
}