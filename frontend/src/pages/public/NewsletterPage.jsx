// ============================================================
// FRONTEND src/pages/public/NewsletterPage.jsx
// ============================================================

import React from 'react';
import Newsletter from '../../components/common/Newsletter';

const NewsletterPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Newsletter</h1>
        <p className="text-text-secondary mt-2">
          Stay updated with the latest articles, tutorials, and projects.
        </p>
      </div>
      <Newsletter />
    </div>
  );
};

export default NewsletterPage;