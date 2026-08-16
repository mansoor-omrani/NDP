import React, { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  const handleSave = () => {
    // TODO: Call save profile API
    setMessage('Profile saved successfully.');
  };

  if (!user) {
    return <p className="text-center py-8">Please login first.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
            {user.firstName?.[0] || user.userName?.[0]}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Username</label>
            <p className="font-semibold">{user.userName}</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">First Name</label>
            <p className="font-semibold">{user.firstName}</p>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Last Name</label>
            <p className="font-semibold">{user.lastName}</p>
          </div>
        </div>
        {message && <p className="text-green-600">{message}</p>}
        <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
