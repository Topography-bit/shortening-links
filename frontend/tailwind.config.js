/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dceeff",
          200: "#b9dcff",
          300: "#8ec6ff",
          400: "#60a8ff",
          500: "#3d86ff",
          600: "#2d67e6",
          700: "#244fba",
          800: "#1f428f",
          900: "#1d3a73"
        }
      }
    }
  },
  plugins: []
}



