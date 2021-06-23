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
    safelist: [/^(translate-x-full-)/, /^(grid-cols)/, /^(w-1\/)/, /^(h-)/]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          DEFAULT: 'var(--color-fill)',
          muted: 'var(--color-fill-muted)',
          'accent-primary': 'var(--color-accent-primary)',
          'accent-primary-light': 'var(--color-accent-primary-light)',
          'accent-primary-dark': 'var(--color-accent-primary-dark)',
          'accent-secondary': 'var(--color-accent-secondary-light)',
          'accent-secondary-light': 'var(--color-accent-secondary-light)',
          'accent-secondary-dark': 'var(--color-accent-secondary-dark)'
        }
      },
      textColor: {
        skin: {
          DEFAULT: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
          'muted-light': 'var(--color-text-muted-light)',
          'muted-dark': 'var(--color-text-muted-dark)',

          'accent-primary': 'var(--color-accent-primary)'
          // 'accent-primary-light': 'var(--color-accent-primary-light)',
          // 'accent-primary-dark': 'var(--color-accent-primary-dark)',
          // 'accent-secondary': 'var(--color-accent-secondary-light)',
          // 'accent-secondary-light': 'var(--color-accent-secondary-light)',
          // 'accent-secondary-dark': 'var(--color-accent-secondary-dark)'
        }
      },
      // gradientColorStops: (theme) => ({
      //   'accent-primary': 'var(--color-accent-primary)',
      //   'accent-primary-light': 'var(--color-accent-primary-light)',
      //   'accent-primary-dark': 'var(--color-accent-primary-dark)',
      //   'accent-secondary': 'var(--color-accent-secondary-light)',
      //   'accent-secondary-light': 'var(--color-accent-secondary-light)',
      //   'accent-secondary-dark': 'var(--color-accent-secondary-dark)'
      // }),
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
      }),
      letterSpacing: {
        extrawide: '0.15em'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
