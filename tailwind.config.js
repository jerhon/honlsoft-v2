module.exports = {
  content: ['./src/**/*.{tsx,jsx}'],
  theme: {
    screens: {
      'laptop': '1024px',
      'desktop': '1280px'
    },
    extend: {
      fontFamily: {
        title: ['Oswald'],
        sans: ['Montserrat']
      },
      colors: {
        white: '#ffffff',
        black: '#000000',
        primary: '#0d47a1',
        secondary: '#b71c1c',
        menu: '#000000de',
        highlight: '#e8e8e0'
      }
    },
  },

  plugins: [],
}
