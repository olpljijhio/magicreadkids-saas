/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#c471ed",
        secondary: "#f64f59",
        accent: "#ff89bb",
        bg: "#fffafc"
      },
      fontFamily: {
        sans: ["Poppins", "Nunito", "sans-serif"]
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #c471ed 0%, #f64f59 100%)"
      }
    }
  },
  plugins: []
};
