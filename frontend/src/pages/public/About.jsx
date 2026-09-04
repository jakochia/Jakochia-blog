// ============================================================
// FRONTEND src/pages/public/About.jsx
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero / Intro Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/20 dark:border-blue-800/20 p-8 md:p-12 mb-12 shadow-xl backdrop-blur-sm">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar placeholder – you can replace with an actual image */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-5xl text-white font-bold shadow-2xl shadow-blue-500/30">
            NA
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Newton Asha
            </h1>
            <p className="text-xl text-text-secondary mb-4">
              Software Engineering Student &amp; Cisco Networking Academy Instructor
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass-dark text-sm border border-white/10">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Nairobi, Kenya
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass-dark text-sm border border-white/10">
                🚀 5+ Projects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What I Do – Grid of Cards */}
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">What I Do</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="group p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="text-4xl mb-3">💻</div>
          <h3 className="text-xl font-semibold mb-2">Software Engineering</h3>
          <p className="text-text-secondary text-sm">Building web applications with React, Node.js, and MongoDB.</p>
        </div>
        <div className="group p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="text-4xl mb-3">🌐</div>
          <h3 className="text-xl font-semibold mb-2">Networking &amp; Cisco</h3>
          <p className="text-text-secondary text-sm">Teaching and configuring networking infrastructure.</p>
        </div>
        <div className="group p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Cybersecurity</h3>
          <p className="text-text-secondary text-sm">Exploring ethical hacking and IT security practices.</p>
        </div>
        <div className="group p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 dark:hover:border-blue-600/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
          <div className="text-4xl mb-3">☁️</div>
          <h3 className="text-xl font-semibold mb-2">Cloud &amp; AI</h3>
          <p className="text-text-secondary text-sm">Working with cloud platforms and artificial intelligence tools.</p>
        </div>
      </div>

      {/* Experience + Projects in a two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Experience Card */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">📋</span> Experience
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Cisco Networking Academy Instructor</h3>
              <p className="text-sm text-text-secondary">MOHI Namarei · Present</p>
              <p className="text-sm mt-1">Provide technical support, teach networking, maintain ICT infrastructure.</p>
            </div>
            <div className="border-l-4 border-cyan-400 pl-4">
              <h3 className="font-semibold">Freelance Web Developer</h3>
              <p className="text-sm text-text-secondary">2022 – Present</p>
              <p className="text-sm mt-1">Built custom websites and web applications for various clients.</p>
            </div>
          </div>
        </div>

        {/* Projects & Connect */}
        <div className="p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-cyan-500">🚀</span> Projects
            </h2>
            <p className="text-text-secondary mb-4">
              I build projects that solve real problems. Some highlights:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1 text-sm">
              <li><strong>MOHI Cisco Portal</strong> – Learning management system</li>
              <li><strong>Personal Finance Tracker</strong> – Budgeting &amp; expense tracking</li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-medium shadow-md hover:shadow-blue-500/30 transition-all hover:scale-105"
            >
              View All Projects
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-5 py-2 rounded-full glass-dark text-text border border-white/10 hover:border-white/20 transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Connect section – social links */}
      <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50/30 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/20 dark:border-blue-800/20">
        <h2 className="text-2xl font-bold mb-3">Let's Connect</h2>
        <p className="text-text-secondary mb-4">Find me on GitHub or reach out via the contact form.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/jakochia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-900 dark:bg-neutral-800 text-white hover:bg-neutral-700 transition-colors text-sm"
          >
            <span className="mr-2">🐙</span> GitHub
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
          >
            ✉️ Contact Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;