// ============================================================
// FRONTEND src/components/blog/ShareButtons.jsx
// ============================================================

import React, { useState } from 'react';

const ShareButtons = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
  };

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
      icon: '🐦',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
      icon: '🔗',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
      icon: '📘',
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      icon: '💬',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decodeURIComponent(shareData.url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-text-secondary mr-1">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xl"
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm"
        aria-label="Copy link"
      >
        {copied ? '✅ Copied!' : '📋 Copy'}
      </button>
    </div>
  );
};

export default ShareButtons;