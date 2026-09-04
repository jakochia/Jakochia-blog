/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      colors: {
        background: 'rgba(var(--color-bg), <alpha-value>)',
        'background-secondary': 'rgba(var(--color-bg-secondary), <alpha-value>)',
        text: 'rgba(var(--color-text), <alpha-value>)',
        'text-secondary': 'rgba(var(--color-text-secondary), <alpha-value>)',
        border: 'rgba(var(--color-border), <alpha-value>)',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #0a0a0f 0%, #111827 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-slow': 'gradient-slow 20s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'gradient-slow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        'premium': '0 20px 60px -15px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 40px -10px rgba(59, 130, 246, 0.25)',
        'glow-strong': '0 0 60px -15px rgba(59, 130, 246, 0.4)',
      },
    },
  },
  plugins: [],
}