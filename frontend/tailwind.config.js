/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          blue: {
            50: '#f0f7ff',
            100: '#e0effe',
            500: '#0284c7',
            600: '#0369a1',
            700: '#075985',
          },
          green: {
            50: '#f0fdf4',
            500: '#22c55e',
            600: '#16a34a',
          },
          emergency: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          }
        }
      }
    },
  },
  plugins: [],
}
