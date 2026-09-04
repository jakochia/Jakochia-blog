// ============================================================
// FRONTEND src/components/blog/TableOfContents.jsx
// ============================================================

import React, { useState, useEffect } from 'react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!content) return;

    const headingRegex = /^##+\s+(.+)$/gm;
    const matches = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[1];
      const level = match[0].split('#').length - 1;
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      matches.push({ text, level, id });
    }

    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -40% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="my-6 p-4 bg-background-secondary rounded-lg border border-border">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
        Table of Contents
      </h4>
      <ul className="space-y-1 text-sm">
        {headings.map(({ text, level, id }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}
            className="transition-colors"
          >
            <a
              href={`#${id}`}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeId === id ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-text-secondary'
              }`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;