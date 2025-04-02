import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Dashboard</h2>
      <p className="mb-4">Welcome to your dashboard!</p>
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