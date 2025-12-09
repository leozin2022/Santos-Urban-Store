/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
