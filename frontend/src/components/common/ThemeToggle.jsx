// ============================================================
// FRONTEND src/components/common/ThemeToggle.jsx
// ============================================================

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 group ${
        theme === 'dark'
          ? // Dark mode styles
            'bg-[#1E1B4B]/80 hover:bg-[#2563EB]/30 border border-[#2563EB]/30 hover:border-[#EA580C]/50 text-[#F8FAFC]/60 hover:text-[#EA580C] shadow-[0_0_20px_rgba(37,99,235,0.1)]'
          : // Light mode styles
            'bg-[#F8FAFC]/80 hover:bg-[#2563EB]/10 border border-[#2563EB]/20 hover:border-[#EA580C]/40 text-[#334155]/50 hover:text-[#2563EB]'
      }`}
      aria-label="Toggle theme"
    >
      <span className="inline-block transition-transform duration-500 group-hover:scale-110 group-active:scale-90">
        {theme === 'dark' ? (
          // Sun icon – click to switch to light
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          // Moon icon – click to switch to dark
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;