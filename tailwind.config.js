/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",                // <--- IMPORTANTE: Pega arquivos soltos na raiz (App.tsx, index.tsx)
    "./components/**/*.{js,ts,jsx,tsx}",  // <--- Pega tudo dentro da pasta components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Rubik Wet Paint"', 'cursive'],
        bubble: ['"Modak"', 'cursive'],
      },
      colors: {
        urban: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1f1f1f',
        }
      }
    },
  },
  plugins: [],
}
