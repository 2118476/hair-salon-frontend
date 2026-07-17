/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium London salon palette
        ink: '#141414',
        ivory: '#F7F2EA',
        bronze: '#B77A46',
        burgundy: '#642A3A',
        sage: '#657568',
        // Semantic tokens (kept so existing components inherit the new look)
        primary: '#141414',
        accent: '#B77A46',
        background: '#F7F2EA',
        surface: '#FFFFFF',
        'text-primary': '#141414',
        'text-secondary': '#5B5B52',
        error: '#B4402E',
        success: '#4F6F52',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
