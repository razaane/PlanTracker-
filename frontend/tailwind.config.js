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
          DEFAULT: '#3F5B44',
          light: '#4E6F54',
          dark: '#304735',
        },
        sage: {
          DEFAULT: '#B7C99A',
          light: '#C9D7B3',
          dark: '#9CB17E',
        },
        rose: {
          DEFAULT: '#E7AEB4',
          light: '#F0C5CA',
          dark: '#D99198',
        },
        wine: {
          DEFAULT: '#8C3B4C',
          light: '#A44A5D',
          dark: '#6F2D3B',
        },
        cream: {
          DEFAULT: '#F5F1E6',
          dark: '#EAE3D2',
          light: '#FCFAF6',
        },
        slateCustom: '#526D82',
      },
      fontFamily: {
        sans: ['Inter', 'Calibri', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
