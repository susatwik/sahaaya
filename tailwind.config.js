/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sahaaya: {
          navy: '#173F91',
          'navy-dark': '#0F2B66',
          'navy-light': '#2558BC',
          teal: '#159B78',
          'teal-dark': '#0E7359',
          'teal-light': '#1EC298',
          'soft-blue': '#EAF3FF',
          'soft-green': '#E7F7EF',
          'soft-amber': '#FFF4E5',
          'soft-rose': '#FDE8E8',
          amber: '#D97706',
          red: '#D32F2F',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: [
          'Noto Sans Telugu',
          'Gautami',
          'Vani',
          'Tunga',
          'Pothana2000',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        telugu: [
          'Noto Sans Telugu',
          'Gautami',
          'Vani',
          'Tunga',
          'Pothana2000',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
