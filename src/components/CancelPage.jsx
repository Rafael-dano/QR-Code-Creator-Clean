import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-700 mb-4">⚠️ Payment Cancelled</h1>
      <p className="text-lg mb-6">No worries — you can try again anytime.</p>
      <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
        Back to Generator
      </Link>
    </div>
  );
};

export default CancelPage;
