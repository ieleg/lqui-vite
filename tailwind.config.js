/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      font: {
        1: '#2B2A35',
        2: '#5C5A74',
        3: '#898899',
        4: '#CDCCD9'
      },
      main: {
        1: "#7369CC",
        2: "#877BF4",
        3: "#BAB4EF",
        4: "#DBD7FC",
        5: "#F5F4FF",
        6: "#F9F9FF",
        7: "#FBFBFD",
      },
      red: {
        1: "#F04848",
        2: "#FFDBDB",
        3: "#FFF2F2",
        4: "#FFF6F6",
      },
      text: {
        1: "#2B2A35",
        2: "#5C5A74",
        3: "#898899",
        4: "#CDCCD9",
      },
      blueGreen: {
        1: '#148EB5',
        2: '#E2F6FB'
      },
      shadowColor: {
        1: '#F5F4FC'
      },
      icon: {
        1: '#B1AED2',
        2: 'red'
      },
      white: '#ffffff'
    },
  },
  plugins: [],
}