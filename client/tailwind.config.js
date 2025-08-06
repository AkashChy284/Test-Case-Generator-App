/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // ✅ Enables Tailwind in all src files
  darkMode: 'class', // ✅ Enable manual dark mode using 'dark' class on <html>
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // ✅ Custom font
      },
    },
  },
  plugins: [],
};
