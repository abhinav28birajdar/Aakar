/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#EE4D2D',
        secondary: '#33A4DC',
        accent: '#FAD73A',
        dark: '#1C1C1E',
        light: '#F8F8F8',
        'text-primary': '#121212',
        'text-secondary': '#5A5A5A',
        border: '#E0E0E0',
        success: '#4CAF50',
        error: '#F44336',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
