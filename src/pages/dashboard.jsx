import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get('verify-auth/');
      } catch (err) {
        handleLogout();
      }
    };
    verifyAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('logout/');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
        Welcome {userEmail}!
      </h2>
      <p className="text-center mb-6 text-gray-600">
        You are successfully authenticated
      </p>
      <div className="space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;