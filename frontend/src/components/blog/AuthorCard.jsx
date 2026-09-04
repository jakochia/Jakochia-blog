// ============================================================
// FRONTEND src/components/blog/AuthorCard.jsx
// ============================================================

import React from 'react';

const AuthorCard = () => {
  return (
    <div className="mt-8 p-6 bg-background-secondary rounded-xl border border-border flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
        NA
      </div>
      <div>
        <h3 className="font-semibold">Newton Asha (Jakochia)</h3>
        <p className="text-sm text-text-secondary mt-1">
          Software Engineering student, Cisco Networking Academy Instructor, and technology enthusiast.
          Exploring software engineering, networking, cybersecurity, AI, and building projects along the way.
        </p>
        <div className="flex gap-4 mt-2 text-sm">
          <a
            href="https://github.com/jakochia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-text-secondary hover:text-text transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;