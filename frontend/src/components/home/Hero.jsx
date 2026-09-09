import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background – strictly using palette colors */}
      <div
        className={`absolute inset-0 animate-gradient-xy ${
          isDark
            ? 'bg-gradient-to-br from-[#1E1B4B] via-[#1E1B4B]/80 to-[#EA580C]/30'
            : 'bg-gradient-to-br from-[#F8FAFC] via-[#E2E8F0] to-[#2563EB]/10'
        }`}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Floating orbs – using primary, accent, secondary */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-float ${
            isDark ? 'bg-[#2563EB]/30' : 'bg-[#2563EB]/10'
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
            isDark ? 'bg-[#EA580C]/20' : 'bg-[#EA580C]/10'
          }`}
          style={{ animationDelay: '2s' }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse ${
            isDark ? 'bg-[#F8FAFC]/5' : 'bg-[#1E1B4B]/5'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge – glassmorphism with primary or accent */}
        <div
          className={`inline-block mb-4 px-5 py-1.5 rounded-full backdrop-blur-sm border text-sm font-medium tracking-wide shadow-[0_0_20px_rgba(234,88,12,0.15)] ${
            isDark
              ? 'bg-[#2563EB]/20 border-[#EA580C]/40 text-[#EA580C]'
              : 'bg-white/80 border-[#2563EB]/30 text-[#2563EB]'
          }`}
        >
          Newton Asha · Software Engineer &amp; Cisco Instructor
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight">
          <span className={isDark ? 'text-[#F8FAFC] drop-shadow-lg' : 'text-[#1E1B4B] drop-shadow-lg'}>
            Code. Build.
          </span>
          <br />
          <span
            className={`text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(234,88,12,0.25)] ${
              isDark
                ? 'bg-gradient-to-r from-[#EA580C] to-[#2563EB]'
                : 'bg-gradient-to-r from-[#2563EB] to-[#EA580C]'
            }`}
          >
            Learn. Share.
          </span>
        </h1>

        <div className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto">
          <TypeAnimation
            sequence={[
              'Exploring software engineering, networking, cybersecurity, AI and the technology I build along the way.',
              3000,
              'Building projects that solve real problems.',
              3000,
              'Teaching networking and Cisco technologies.',
              3000,
              'Sharing knowledge through tutorials and articles.',
              3000,
            ]}
            wrapper="p"
            speed={50}
            repeat={Infinity}
            className={isDark ? 'text-[#F8FAFC]/80 drop-shadow-md' : 'text-[#334155]/80 drop-shadow-sm'}
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/blog"
            className={`px-8 py-3.5 rounded-full font-medium text-lg transition-all hover:scale-105 active:scale-95 relative overflow-hidden group ${
              isDark
                ? 'bg-[#EA580C] text-[#1E1B4B] shadow-[0_8px_30px_rgba(234,88,12,0.5)] hover:shadow-[0_8px_40px_rgba(234,88,12,0.7)]'
                : 'bg-[#2563EB] text-white shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.6)]'
            }`}
          >
            <span className="relative z-10">Explore Blog</span>
            <span
              className={`absolute inset-0 transition-opacity duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-[#F8FAFC] to-[#EA580C] opacity-0 group-hover:opacity-20'
                  : 'bg-gradient-to-r from-[#EA580C] to-[#2563EB] opacity-0 group-hover:opacity-100'
              }`}
            />
          </Link>
          <Link
            to="/projects"
            className={`px-8 py-3.5 rounded-full backdrop-blur-sm font-medium text-lg border transition-all hover:scale-105 active:scale-95 ${
              isDark
                ? 'bg-[#2563EB]/10 text-[#F8FAFC] border-[#2563EB]/30 hover:border-[#EA580C]/50 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)]'
                : 'bg-white/50 text-[#1E1B4B] border-[#2563EB]/20 hover:border-[#EA580C]/40 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]'
            }`}
          >
            View Projects
          </Link>
        </div>

        {/* Scroll indicator – accent/primary */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className={`w-6 h-10 rounded-full border-2 flex justify-center ${
              isDark ? 'border-[#EA580C]/50' : 'border-[#2563EB]/40'
            }`}
          >
            <div
              className={`w-1 h-3 rounded-full mt-2 ${
                isDark ? 'bg-[#EA580C]/70' : 'bg-[#2563EB]/60'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;