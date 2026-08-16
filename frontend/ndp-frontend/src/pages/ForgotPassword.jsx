import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('If the account exists, a reset link has been sent.');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <p className="text-gray-600 mb-4 text-center">Enter your email or phone number to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email or Phone</label>
          <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Send Reset Link
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
