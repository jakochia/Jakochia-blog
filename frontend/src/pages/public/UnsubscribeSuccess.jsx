import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Layout from '../../components/common/Layout';

const UnsubscribeSuccess = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#F8FAFC]' : 'text-[#1E1B4B]'}`}>
          Unsubscribed
        </h1>
        <p className={`mb-2 ${isDark ? 'text-[#F8FAFC]/70' : 'text-[#334155]/80'}`}>
          {email
            ? `You have been unsubscribed from the Jakochia Blog newsletter.`
            : 'You have been unsubscribed.'}
        </p>
        <p className={`text-sm ${isDark ? 'text-[#F8FAFC]/50' : 'text-[#334155]/60'}`}>
          You will no longer receive emails from us.
        </p>
        <Link
          to="/"
          className={`inline-block mt-6 font-medium transition-colors duration-300 ${
            isDark ? 'text-[#EA580C] hover:text-[#F8FAFC]' : 'text-[#2563EB] hover:text-[#EA580C]'
          }`}
        >
          ← Return to Blog
        </Link>
      </div>
    </Layout>
  );
};

export default UnsubscribeSuccess;