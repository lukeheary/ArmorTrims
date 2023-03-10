module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      height: {
        '30': '120px',
        '125': '400px',
        '162': '648px'
      },
      backgroundImage: {
        'bg-image': "url('assets/background.png')",
      }
    },
  },
  plugins: [],
}