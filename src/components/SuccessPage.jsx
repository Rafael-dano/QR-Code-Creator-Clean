import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
      <p className="text-lg mb-6">Thank you for your purchase. Your premium QR code is now unlocked.</p>
      <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Back to Generator
      </Link>
    </div>
  );
};

export default SuccessPage;
