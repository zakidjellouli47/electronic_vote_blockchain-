// src/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      
      try {
        await api.get('verify-auth/'); // You'll need to create this endpoint in your backend
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('email');
        navigate('/');
      }
    };
    
    verifyAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('logout/'); // You'll need to create this endpoint in your backend
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Dashboard</h2>
      <p className="mb-4">Welcome, {localStorage.getItem('email')}!</p>
      <button 
        onClick={handleLogout}
        className="w-full bg-red-600 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;