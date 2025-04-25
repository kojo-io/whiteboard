/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        hover: 'rgb(var(--color-primary-hover))',
        secondary: 'rgb(var(--color-secondary))',
      }
    },
  },
  plugins: [],
}

