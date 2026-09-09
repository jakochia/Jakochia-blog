import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gradient-blue">Terms of Use</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        <p>Welcome to Jakochia Blog. By using this website, you agree to the following terms.</p>

        <h2>Content</h2>
        <ul>
          <li>All content is for informational purposes only.</li>
          <li>We do not guarantee accuracy or completeness.</li>
          <li>Content may be updated or removed at any time.</li>
        </ul>

        <h2>User Conduct</h2>
        <ul>
          <li>Be respectful in comments and interactions.</li>
          <li>Do not post spam, harmful links, or offensive content.</li>
          <li>We reserve the right to moderate or remove comments.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>All content (text, images, code) is owned by Newton Asha unless otherwise noted. Unauthorized reproduction is prohibited.</p>

        <h2>Limitation of Liability</h2>
        <p>We are not liable for any damages arising from the use of this website.</p>

        <p>
          If you have any questions, contact us at{' '}
          <a href="mailto:ombuyanewton@gmail.com" className="text-primary-500 hover:text-primary-600">
            ombuyanewton@gmail.com
          </a>.
        </p>

        <Link to="/" className="inline-block mt-6 text-primary-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Terms;