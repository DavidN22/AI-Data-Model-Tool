/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        wave: "waveAnim 1.2s infinite ease-in-out",
      },
      keyframes: {
        waveAnim: {
          "0%, 100%": { transform: "scaleY(0.5)", opacity: 0.6 },
          "50%": { transform: "scaleY(1.2)", opacity: 1 },
        },
      },
    }
  },
  plugins: [],
}


