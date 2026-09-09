import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const UnsubscribeSuccess = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">Unsubscribed</h1>
      <p className="text-text-secondary mb-2">
        {email ? `You have been unsubscribed from the Jakochia Blog newsletter.` : 'You have been unsubscribed.'}
      </p>
      <p className="text-text-secondary text-sm">
        You will no longer receive emails from us.
      </p>
      <Link to="/" className="inline-block mt-6 text-primary-400 hover:underline">
        ← Return to Blog
      </Link>
    </div>
  );
};

export default UnsubscribeSuccess;