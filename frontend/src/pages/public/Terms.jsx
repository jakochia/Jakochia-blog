import React from 'react';
import Layout from '../../components/common/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gradient-blue">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By using this website, you agree to these terms. If you do not agree, please do not use the site.</p>
          
          <h2>2. Content Ownership</h2>
          <p>All content on this site (articles, images, code snippets, etc.) is the property of Newton Asha (Jakochia) unless otherwise stated. You may not reproduce, distribute, or commercialize any content without permission.</p>
          
          <h2>3. User Comments</h2>
          <p>Comments are moderated. We reserve the right to delete any comment that is abusive, spam, or off-topic.</p>
          
          <h2>4. Disclaimer</h2>
          <p>The information on this site is provided "as is" for educational and informational purposes. No warranty is made about the accuracy or completeness of the content.</p>
          
          <h2>5. Changes</h2>
          <p>We may update these terms from time to time. Continued use of the site constitutes acceptance of the updated terms.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;