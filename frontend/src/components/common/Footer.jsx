import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-background-secondary/50 backdrop-blur-sm mt-16 overflow-hidden">
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-display font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent hover:from-blue-400 hover:to-cyan-300 transition-all">
              JAKOCHIA
            </Link>
            <p className="mt-3 text-sm text-text-secondary max-w-md leading-relaxed">
              Code. Build. Learn. Share. — Exploring software engineering, networking,
              cybersecurity, AI and the technology I build along the way.
            </p>
            <div className="flex space-x-3 mt-4">
              <a
                href="https://github.com/jakochia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 dark:bg-white/5 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-glow-blue group"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 text-text-secondary group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full bg-white/10 dark:bg-white/5 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-glow-blue group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-text-secondary group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Navigation</h3>
            <ul className="mt-3 space-y-2.5">
              {['Blog', 'Projects', 'Tutorials', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-text-secondary hover:text-white dark:hover:text-white transition-colors relative group inline-block"
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Resources</h3>
            <ul className="mt-3 space-y-2.5">
              <li><a href="/rss.xml" className="text-sm text-text-secondary hover:text-white dark:hover:text-white transition-colors">RSS Feed</a></li>
              <li><a href="/sitemap.xml" className="text-sm text-text-secondary hover:text-white dark:hover:text-white transition-colors">Sitemap</a></li>
              <li><Link to="/privacy" className="text-sm text-text-secondary hover:text-white dark:hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-text-secondary hover:text-white dark:hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider with subtle gradient */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center relative">
          {/* Gradient line overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

          <p className="text-sm text-text-secondary">
            &copy; {currentYear} <span className="font-medium text-text">Newton Asha (Jakochia)</span>. All rights reserved.
          </p>
          <p className="text-sm text-text-secondary mt-2 sm:mt-0 flex items-center gap-1">
            Built with <span className="text-rose-500">❤</span> using React, Node.js &amp; MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;