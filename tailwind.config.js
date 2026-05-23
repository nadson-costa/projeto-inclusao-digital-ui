/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'orange-primary': '#F97316',
        'orange-dark': '#C2410C',
        'amber-accent': '#FBBF24',
        'bg-light': '#FFFBF5',
        'bg-dark': '#1C1917',
        'surface-dark': '#292524',
        'text-muted': '#78716C',
        'border-base': '#E7E5E4',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '14px',
        'input': '12px',
      }
    }
  },
  plugins: []
};
