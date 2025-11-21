/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        'primary-hover': '#2563EB',
        'primary-press': '#1D4ED8',
        'primary-dark': '#1E40AF',
        'primary-disabled': '#3B82F64D',
        secondary: '#10B981',
        'secondary-hover': '#059669',
        'secondary-press': '#047857',
        'secondary-disabled': '#10B9814D',
        'text-primary': '#514062',
        'base-light': '#FBE2CA',
        'base-dark': '#332D2D',

        // トースト用のより鮮明な色定義
        'toast-info': '#007BFF',
        'toast-info-hover': '#0056B3',
        'toast-error': '#DC3545',
        'toast-error-hover': '#BD2130',
        'toast-success': '#28A745',
        'toast-success-hover': '#218838',
        'toast-tool': '#3B82F6',
        'toast-tool-hover': '#2563EB',
      },
      fontFamily: {
        M_PLUS_2: ['Montserrat', 'M_PLUS_2', 'sans-serif'],
        Montserrat: ['Montserrat', 'sans-serif'],
      },
      zIndex: {
        5: '5',
        15: '15',
      },
      width: {
        'col-span-2': '184px',
        'col-span-4': '392px',
        'col-span-7': '704px',
      },
    },
  },
  plugins: [],
}
