import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Calendar, Vote, Wallet, LogOut, User, Award, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [elections, setElections] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if we have a token first
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/', { replace: true });
          return;
        }

        // Verify auth first
        const authRes = await api.verifyAuth();
        console.log('Auth verification successful:', authRes.data);
        setUserData(authRes.data);
        
        // Check if wallet is connected
        if (authRes.data.wallet_address) {
          setWalletConnected(true);
        }

        // Then get elections
        try {
          const electionsRes = await api.getElections();
          setElections(electionsRes.data);
        } catch (electionsError) {
          console.warn('Failed to fetch elections:', electionsError);
          // Don't fail the whole dashboard if elections fail
          setElections([]);
        }
        
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      navigate('/', { replace: true });
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        await api.connectWallet(accounts[0]);
        setWalletConnected(true);
        // Refresh user data instead of full page reload
        const authRes = await api.verifyAuth();
        setUserData(authRes.data);
      } catch (err) {
        console.error('Wallet connection failed:', err);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl flex justify-center items-center">
          <p className="text-purple-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if userData is null after loading
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

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 relative">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Hello, {userData?.username || userData?.email?.split('@')[0]}!
            </h2>
            <p className="text-purple-100">Welcome to your secure voting dashboard</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-white text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-full flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 right-10 w-20 h-20 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-5 right-20 w-10 h-10 bg-purple-300 rounded-full opacity-30"></div>
      </div>
      
      {/* Main content */}
      <div className="p-8">
        {/* Account card with glass morphism effect */}
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 shadow-sm backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
            <User size={20} className="mr-2" />
            Your Account
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium text-purple-700">
                  {userData?.is_candidate ? 'Candidate' : 'Elector'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Wallet size={24} className={walletConnected ? "text-green-600" : "text-purple-600"} />
              </div>
              <div>
                {walletConnected ? (
                  <div>
                    <p className="text-sm text-gray-500">Wallet</p>
                    <p className="font-medium text-green-600">Connected</p>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm transition-all"
                  >
                    Connect MetaMask Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {userData?.is_elector && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-purple-600 mb-6 flex items-center">
              <Vote size={22} className="mr-2" />
              Active Elections
            </h3>
            
            {elections.length === 0 ? (
              <div className="bg-purple-50 rounded-2xl p-10 text-center">
                <div className="inline-flex justify-center items-center bg-purple-100 p-3 rounded-full mb-4">
                  <Calendar size={28} className="text-purple-500" />
                </div>
                <p className="text-gray-500">No active elections at the moment</p>
                <p className="text-sm text-purple-400 mt-2">Check back later for upcoming votes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {elections.map(election => (
                  <div 
                    key={election.id} 
                    className="bg-white border border-purple-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate(`/elections/${election.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-purple-700 group-hover:text-purple-600">
                        {election.title}
                      </h4>
                      <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                        Active
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {new Date(election.start_time).toLocaleDateString()} - 
                        {new Date(election.end_time).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="flex items-center text-purple-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        <span>Vote now</span>
                        <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {userData?.is_candidate && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/elections/create')}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center"
            >
              <span>Create New Election</span>
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        )}
      </div>
      
      {/* Footer with decorative elements */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 text-center text-xs text-purple-400">
        Secure blockchain voting platform powered by Ethereum & Hyperledger Fabric
      </div>
    </div>
  );
};

export default Dashboard;