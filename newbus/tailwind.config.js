/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': {'max': '368px'},  
        'sm': {'max': '640px'},  
        'md': {'max': '768px'}, 
        'lg': {'max': '1024px'}, 
        'xl': {'max': '1280px'}, 
        '2xl': {'max': '1536px'} 
      },
    },
  },
  plugins: [],
}