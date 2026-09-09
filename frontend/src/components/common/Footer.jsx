import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#2563EB]/10 bg-[#F8FAFC]/95 backdrop-blur-xl mt-16 overflow-hidden">
      {/* Subtle gradient glow at top – Accent Orange */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#EA580C]/30 to-transparent" />

      {/* Animated background orbs – Primary & Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#EA580C]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
            >
              {/* J Logo – Primary & Secondary gradient background, Accent stroke */}
              <svg
                className="w-10 h-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Jakochia Logo"
              >
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </linearGradient>
                  <filter id="footerLogoShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1E1B4B" floodOpacity="0.3" />
                  </filter>
                </defs>
                <rect width="100" height="100" rx="24" fill="url(#footerLogoGrad)" filter="url(#footerLogoShadow)" />
                <rect width="100" height="50" rx="24" fill="white" fillOpacity="0.12" clipPath="url(#footerClip)" />
                <clipPath id="footerClip"><rect width="100" height="100" rx="24" /></clipPath>
                {/* J stroke – Accent Orange */}
                <path
                  d="M 32 35 H 68 V 65 C 68 73, 62 82, 50 82 H 42 C 30 82, 24 73, 24 65 V 56"
                  stroke="#EA580C"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#footerLogoShadow)"
                />
                <path
                  d="M 32 35 H 68 V 65 C 68 73, 62 82, 50 82 H 42 C 30 82, 24 73, 24 65 V 56"
                  stroke="#F8FAFC"
                  strokeOpacity="0.2"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-1.5, -1.5)"
                />
                {/* Decorative dots – Accent */}
                <g fill="#EA580C" fillOpacity="0.7">
                  <circle cx="68" cy="16" r="2.5" />
                  <circle cx="76" cy="16" r="2.5" />
                  <circle cx="84" cy="16" r="2.5" />
                </g>
              </svg>

              <span className="text-2xl font-display font-bold bg-gradient-to-r from-[#2563EB] to-[#1E1B4B] bg-clip-text text-transparent hover:from-[#1E1B4B] hover:to-[#EA580C] transition-all duration-500">
                JAKOCHIA
              </span>
            </Link>

            <p className="mt-4 text-sm text-[#334155]/70 max-w-md leading-relaxed">
              Code. Build. Learn. Share. — Exploring software engineering, networking,
              cybersecurity, AI and the technology I build along the way.
            </p>

            <div className="flex space-x-3 mt-5">
              <a
                href="https://github.com/jakochia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#2563EB]/5 hover:bg-[#EA580C]/20 border border-[#2563EB]/10 hover:border-[#EA580C]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] group"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 text-[#334155]/50 group-hover:text-[#EA580C] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-[#2563EB]/5 hover:bg-[#EA580C]/20 border border-[#2563EB]/10 hover:border-[#EA580C]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-[#334155]/50 group-hover:text-[#EA580C] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-[#2563EB]/5 hover:bg-[#EA580C]/20 border border-[#2563EB]/10 hover:border-[#EA580C]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)] group"
                aria-label="Twitter / X"
              >
                <svg className="w-5 h-5 text-[#334155]/50 group-hover:text-[#EA580C] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#334155]/40">Navigation</h3>
            <ul className="mt-4 space-y-2.5">
              {['Blog', 'Projects', 'Tutorials', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-all duration-300 relative group inline-block"
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#EA580C] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#334155]/40">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="/rss.xml" className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-colors duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]/50 group-hover:bg-[#EA580C] transition-colors" />
                  RSS Feed
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-colors duration-300 inline-flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]/50 group-hover:bg-[#EA580C] transition-colors" />
                  Sitemap
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-colors duration-300">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-colors duration-300">Terms</Link>
              </li>
              {/* NEW: Unsubscribe link */}
              <li>
                <Link to="/unsubscribe" className="text-sm text-[#334155]/60 hover:text-[#2563EB] transition-colors duration-300">
                  Unsubscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-8 border-t border-[#2563EB]/10 flex flex-col sm:flex-row justify-between items-center gap-3 relative">
          {/* Glowing line overlay – Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#EA580C]/20 to-transparent" />

          <p className="text-sm text-[#334155]/50">
            &copy; {currentYear} <span className="font-medium text-[#1E1B4B]">Newton Asha (Jakochia)</span>. All rights reserved.
          </p>

          <p className="text-sm text-[#334155]/50 flex items-center gap-1.5">
            Built with
            <span className="text-[#EA580C] animate-pulse">❤</span>
            using React, Node.js &amp; MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;