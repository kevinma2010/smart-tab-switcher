module.exports = {
    content: ['./src/**/*.{ts,tsx,html}'],
    darkMode: 'class',
    theme: {
      extend: {
        maxHeight: {
          '96': '24rem',
        },
        width: {
          '600': '600px',
        },
        colors: {
          dark: {
            bg: '#202124',
            text: '#e8eaed',
            border: '#5f6368',
            hover: '#3c4043',
          }
        }
      },
    },
    plugins: [],
  }