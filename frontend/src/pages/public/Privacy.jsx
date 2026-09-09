import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gradient-blue">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>At Jakochia Blog, we respect your privacy. This policy explains how we collect and use information.</p>

        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Comments:</strong> Name and email (not publicly displayed).</li>
          <li><strong>Newsletter:</strong> Email address for subscription.</li>
          <li><strong>Analytics:</strong> Non‑identifying data like page views and browser type (no personal information).</li>
        </ul>

        <h2>How We Use It</h2>
        <ul>
          <li>To send you newsletters and updates.</li>
          <li>To improve the blog content and user experience.</li>
          <li>To moderate comments and prevent spam.</li>
        </ul>

        <h2>Cookies</h2>
        <p>We use minimal cookies for theme preference (dark/light) and analytics. You can disable cookies in your browser.</p>

        <h2>Your Rights</h2>
        <p>You can unsubscribe from emails at any time or request deletion of your data by contacting us.</p>

        <p><strong>Contact:</strong> ombuyanewton@gmail.com</p>

        <Link to="https://blog.jakochia.co.ke/unsubscribe" className="inline-block mt-6 text-primary-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Privacy;