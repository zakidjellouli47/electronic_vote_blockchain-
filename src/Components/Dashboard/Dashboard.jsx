// Dashboard.jsx - Main Dashboard Router Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import VoterDashboard from './VoterDashboard';

const Dashboard = ({ api }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const authRes = await api.verifyAuth();
      setUserData(authRes.data.user);
      
      console.log('=== USER DEBUG INFO ===');
      console.log('User:', authRes.data.user);
      console.log('Is Admin:', authRes.data.user.is_admin);
      console.log('Is Approved:', authRes.data.user.approved);
      console.log('Is Elector:', authRes.data.user.is_elector);
      console.log('Selected Election:', authRes.data.user.selected_election_details);
      console.log('======================');
      
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (api && api.logout) {
        await api.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      navigate('/', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl flex justify-center items-center">
          <p className="text-purple-600 font-medium">Loading your dual-blockchain dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl text-center">
          <p className="text-red-600 font-medium mb-4">Failed to load user data</p>
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if (userData.is_admin) {
    return <AdminDashboard api={api} userData={userData} onLogout={handleLogout} />;
  } else {
    return <VoterDashboard api={api} userData={userData} onLogout={handleLogout} />;
  }
};

export default Dashboard;