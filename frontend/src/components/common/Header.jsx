import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { admin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/blog', label: 'Blog' },
    { to: '/projects', label: 'Projects' },
    { to: '/tutorials', label: 'Tutorials' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F8FAFC]/90 backdrop-blur-xl border-b border-[#2563EB]/10 shadow-[0_8px_32px_rgba(37,99,235,0.08)]'
          : 'bg-[#F8FAFC]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo – Primary to Secondary gradient */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Jakochia Logo"
              >
                <defs>
                  <linearGradient id="headerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E1B4B" />
                  </linearGradient>
                  <filter id="headerLogoShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1E1B4B" floodOpacity="0.3" />
                  </filter>
                </defs>
                <rect width="100" height="100" rx="24" fill="url(#headerLogoGrad)" filter="url(#headerLogoShadow)" />
                <rect width="100" height="50" rx="24" fill="white" fillOpacity="0.15" clipPath="url(#headerClip)" />
                <clipPath id="headerClip"><rect width="100" height="100" rx="24" /></clipPath>
                {/* J stroke – Accent Orange */}
                <path
                  d="M 32 35 H 68 V 65 C 68 73, 62 82, 50 82 H 42 C 30 82, 24 73, 24 65 V 56"
                  stroke="#EA580C"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#headerLogoShadow)"
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
                <g fill="#EA580C" fillOpacity="0.7">
                  <circle cx="68" cy="16" r="2.5" />
                  <circle cx="76" cy="16" r="2.5" />
                  <circle cx="84" cy="16" r="2.5" />
                </g>
              </svg>
              {/* Glow ring on hover – Primary Blue */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#2563EB]/20 to-[#EA580C]/20 blur-xl -z-10" />
            </div>

            <span className="text-xl font-display font-bold bg-gradient-to-r from-[#2563EB] to-[#1E1B4B] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              JAKOCHIA
            </span>
            <span className="text-xs text-[#334155]/30 hidden sm:inline">|</span>
            <span className="text-sm text-[#334155]/50 hidden sm:inline font-light tracking-wide">
              Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[#334155] hover:text-[#2563EB] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#EA580C] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-sm px-4 py-1.5 rounded-full bg-[#EA580C] text-white font-medium hover:shadow-[0_0_25px_rgba(234,88,12,0.4)] transition-all duration-300 hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-[#334155] hover:text-[#EA580C] transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#2563EB]/10 transition-colors duration-300 text-[#334155] hover:text-[#2563EB]"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2563EB]/10 bg-[#F8FAFC]/95 backdrop-blur-xl rounded-b-2xl">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm text-[#334155] hover:text-[#2563EB] transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-[#2563EB]/5"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-[#EA580C] hover:text-[#2563EB] px-4 py-2 rounded-lg hover:bg-[#2563EB]/5 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm text-[#334155] hover:text-[#EA580C] px-4 py-2 rounded-lg hover:bg-[#2563EB]/5 transition-colors duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;