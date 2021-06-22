// function withOpacity(variableName) {
//   return ({ opacityValue }) => {
//     if (opacityValue !== undefined) {
//       return `rgba(var(${variableName}), ${opacityValue})`
//     }
//     return `rgb(var(${variableName})))`
//   }
// }

module.exports = {
  // mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          DEFAULT: 'var(--color-fill)',
          muted: 'var(--color-fill-muted)',
          'accent-primary': 'var(--color-accent-primary)',
          'accent-secondary': 'var(--color-accent-secondary)'
        }
      },
      textColor: {
        skin: {
          DEFAULT: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',

          'accent-primary': 'var(--color-accent-primary)',
          'accent-secondary': 'var(--color-accent-secondary)'
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
