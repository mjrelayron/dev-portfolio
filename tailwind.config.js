/* eslint-env node */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: 'var(--navy)', 2: 'var(--navy-2)', 3: 'var(--navy-3)', deep: 'var(--navy-deep)' },
        violet: { DEFAULT: 'var(--violet)', light: 'var(--violet-light)', dark: 'var(--violet-dark)' },
        sky: { DEFAULT: 'var(--sky)', light: 'var(--sky-light)', dark: 'var(--sky-dark)' },
        orange: { DEFAULT: 'var(--orange)', light: 'var(--orange-light)', dark: 'var(--orange-dark)' },
        mint: { DEFAULT: 'var(--mint)', light: 'var(--mint-light)', dark: 'var(--mint-dark)' },
        accent: { DEFAULT: 'var(--accent)', light: 'var(--accent-light)', dark: 'var(--accent-dark)', text: 'var(--accent-text)' },
        ink: { DEFAULT: 'var(--text)', 2: 'var(--text-2)', 3: 'var(--text-3)' },
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },
        gold: 'var(--gold)',
        // legacy aliases still used by the lead tools
        brand: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          tertiary: 'var(--accent-tertiary)',
          warning: 'var(--accent-warning)',
        },
        surface: { base: 'var(--bg-primary)', elevated: 'var(--bg-secondary)' },
        text: { primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', muted: 'var(--text-muted)' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: { panel: '20px' },
      transitionTimingFunction: { out: 'var(--ease-out)', spring: 'var(--ease-spring)' },
    },
  },
  plugins: [],
};
