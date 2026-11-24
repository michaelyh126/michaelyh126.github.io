/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#070B13',
          900: '#0B1120',
          850: '#0F172A',
          800: '#141E33',
          750: '#1B2740',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 189, 248, 0.25), 0 12px 40px -12px rgba(6, 182, 212, 0.22)',
        panel: '0 18px 50px -24px rgba(2, 6, 23, 0.75)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
