// ============================================================
// FRONTEND src/components/common/Layout.jsx
// ============================================================

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ChatWidget from '../chat/ChatWidget';


const Layout = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden ${
        isDark
          ? 'bg-[#0D0D0D] text-[#F5F1E8]'
          : 'bg-[#F8FAFC] text-[#334155]'
      }`}
    >
      {/* Animated background orbs – switch colors based on theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse ${
            isDark
              ? 'bg-[#FF6B35]/20'
              : 'bg-[#2563EB]/10'
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
            isDark
              ? 'bg-[#F5F1E8]/10'
              : 'bg-[#EA580C]/8'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl ${
            isDark
              ? 'bg-[#4169E1]/5'
              : 'bg-[#1E1B4B]/5'
          }`}
        />
      </div>

      {/* Subtle dot grid pattern – opacity and color adapt */}
      <div
        className={`fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,_${isDark ? '#ffffff' : '#1E1B4B'}_1px,_transparent_1px)] bg-[length:24px_24px] ${
          isDark ? 'opacity-[0.05]' : 'opacity-[0.04]'
        }`}
      />

      <Header />
      <main className="flex-1 pt-16 relative z-0">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />

      {/* Fade-in keyframes */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Layout;