/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#D4AF37', // Metallic Gold
          500: '#C5A059', // Darker Gold
          100: '#F9F7F2', // Light gold tint for backgrounds
        },
        cream: '#FDFBF7',
        charcoal: '#1A1A1A',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #C5A059 100%)',
      }
    },
  },
  plugins: [],
}
