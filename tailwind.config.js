/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'primary': '#EE4D2D',      // Main accent/call-to-action
        'primary-dark': '#C73B25', // Darker primary for hover/active states
        'secondary': '#33A4DC',    // Secondary accent
        'accent': '#FAD73A',       // Complementary accent
        
        // Light Mode
        'background': '#FDFDFD',   // App background
        'card': '#FFFFFF',         // Card/container background
        'foreground': '#1A1A1A',   // Primary text
        'muted-foreground': '#666666', // Secondary text
        'border': '#EAEAEA',       // Border color
        
        // Dark Mode
        'dark-background': '#1C1C1E', // App background
        'dark-card': '#2C2C2E',    // Card/container background
        'dark-foreground': '#EFEFEF', // Primary text
        'dark-muted-foreground': '#B3B3B3', // Secondary text
        'dark-border': '#424242',  // Border color
        
        // Semantic Colors
        'success': '#4CAF50',
        'error': '#F44336',
        'warning': '#FFC107',
        'info': '#2196F3'
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semibold': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],
      },
      spacing: {
        'header-h': '56px',  // Standard header height
        'tab-h': '80px',     // Standard tab bar height
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
};
