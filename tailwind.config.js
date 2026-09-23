/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        primaryDark: '#059669',
        surface: '#f6f7fb',
        card: '#ffffff',
        ink: '#111827',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(17, 24, 39, 0.06)',
      },
    },
  },
  plugins: [],
};
