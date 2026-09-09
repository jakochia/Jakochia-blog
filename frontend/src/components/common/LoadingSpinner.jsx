// ============================================================
// FRONTEND src/components/common/LoadingSpinner.jsx
// ============================================================

import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        {/* Outer glow ring – Primary & Accent */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563EB] via-[#1E1B4B] to-[#EA580C] opacity-20 blur-xl animate-pulse" />

        {/* Main spinner – conic gradient with primary → secondary → accent */}
        <div
          className={`${spinnerSize} rounded-full animate-spin-slow`}
          style={{
            background: `conic-gradient(from 0deg, #2563EB, #1E1B4B, #EA580C, #2563EB)`,
            padding: '3px',
            boxShadow: '0 0 30px rgba(37,99,235,0.25)',
          }}
        >
          <div className="w-full h-full rounded-full bg-[#F8FAFC]" />
        </div>

        {/* Inner decorative dot – Accent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
        </div>
      </div>

      {text && (
        <p className="mt-4 text-sm font-medium text-[#334155]/60 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;