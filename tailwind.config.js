/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#22967A',
          dark: '#154D42',
        },
      },
      backgroundImage: {
        'gradient-down': 'linear-gradient(-180deg, #22967A 0%, #154D42 96%)',
      },
    },
  },
  plugins: [],
}
