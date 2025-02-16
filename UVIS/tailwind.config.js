/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping-slow 2s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
};