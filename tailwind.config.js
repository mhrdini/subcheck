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
  purge: {
    content: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/pages/**/*.{js,ts,jsx,tsx}'],
    safelist: [/^(translate-x-full-)/, /^(grid-cols)/, /^(w-1\/)/]
  },
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
      },
      translate: (theme, { negative }) => ({
        ...theme('spacing'),
        ...negative(theme('spacing')),
        'full-1': '100%',
        '-full-1': '-100%',
        'full-2': '200%',
        '-full-2': '-200%',
        'full-3': '300%',
        '-full-3': '-300%',
        'full-4': '400%',
        '-full-4': '-400%'
      })
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
