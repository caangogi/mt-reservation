/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        'blue-app': '#00CCFF',
        'green-app': "#63b000",
        'green-wapp': "#25d366"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
