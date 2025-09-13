/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          // Custom workout app colors
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#8b5cf6', // Primary User A color
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899', // Primary User B color
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          }
        },
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
        minHeight: {
          '44': '2.75rem', // Touch target minimum
        },
        minWidth: {
          '44': '2.75rem', // Touch target minimum
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
    safelist: [
      // Ensure dynamic classes are included
      'bg-purple-500',
      'bg-purple-600',
      'bg-pink-500',
      'bg-pink-600',
      'text-purple-600',
      'text-pink-600',
      'border-purple-500',
      'border-pink-500',
      'bg-purple-100',
      'bg-pink-100',
      'text-purple-800',
      'text-pink-800',
      'from-purple-500',
      'to-purple-600',
      'from-pink-500',
      'to-pink-600',
    ]
  }