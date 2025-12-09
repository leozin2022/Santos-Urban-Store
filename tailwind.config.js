/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",           // <--- Adicionado: Procura arquivos soltos na raiz (App.tsx, index.tsx)
    "./components/**/*.{js,ts,jsx,tsx}", // <--- Adicionado: Procura dentro da pasta components
    "./src/**/*.{js,ts,jsx,tsx}"     // Mantém caso você crie a pasta src no futuro
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Rubik Wet Paint"', 'cursive'],
        bubble: ['"Modak"', 'cursive'],
      },
    },
  },
  plugins: [],
}
