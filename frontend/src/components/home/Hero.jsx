import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation'; // install: npm install react-type-animation

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background – blue to cyan, no purple */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 animate-gradient-xy">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      </div>

      {/* Floating particles for depth – blue and cyan only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge – now uses blue tones */}
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass-dark text-blue-300 text-sm font-medium border border-white/10 backdrop-blur-sm">
          Newton Asha · Software Engineer &amp; Cisco Instructor
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-tight">
          <span className="text-white">Code. Build.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200">
            Learn. Share.
          </span>
        </h1>

        <div className="mt-6 text-xl md:text-2xl text-blue-200/80 max-w-2xl mx-auto">
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
            className="text-blue-100/90"
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/blog"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 transition-all hover:scale-105"
          >
            Explore Blog
          </Link>
          <Link
            to="/projects"
            className="px-8 py-3.5 rounded-full glass-dark text-white font-medium text-lg border border-white/10 hover:border-white/30 transition-all hover:scale-105 backdrop-blur-sm"
          >
            View Projects
          </Link>
        </div>

        {/* Scroll indicator – kept subtle */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;