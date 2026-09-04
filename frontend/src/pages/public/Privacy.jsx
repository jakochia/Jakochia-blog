import React from 'react';
import Layout from '../../components/common/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gradient-blue">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-text-secondary">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>When you subscribe to the newsletter, we collect your email address. When you leave a comment, we collect your name, email address, and the comment content.</p>
          
          <h2>2. How We Use Your Information</h2>
          <p>We use your email to send you blog updates, newsletters, and occasional announcements. We do not sell or share your personal data with third parties.</p>
          
          <h2>3. Cookies</h2>
          <p>We use minimal cookies for theme preference (dark/light) and to prevent abuse on forms. No tracking cookies are used.</p>
          
          <h2>4. Your Rights</h2>
          <p>You can unsubscribe at any time using the link in our emails or by contacting us directly.</p>
          
          <h2>5. Contact</h2>
          <p>If you have any questions, please <a href="/contact" className="text-primary-400">contact us</a>.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;