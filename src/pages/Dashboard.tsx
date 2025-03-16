import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-vote flex items-center justify-center rounded-lg shadow-sm">
              <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 22L25 28L19 34" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M37 22L31 28L37 34" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="27" y="15" width="2" height="26" rx="1" fill="white"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">VoteGuard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Login Successful</h2>
          </div>
          <p className="text-gray-600">You've successfully logged into your account. Welcome to the VoteGuard dashboard!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-scale-in" style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="h-8 w-8 bg-vote-light rounded-md flex items-center justify-center mb-4">
                <div className="h-4 w-4 bg-vote rounded-sm"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Voting Module {i}</h3>
              <p className="text-gray-500 text-sm">This is a placeholder for future voting functionality.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;