import React, { useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={
            <div className="w-full max-w-md">
              {currentForm === 'login' ? 
                <Login onFormSwitch={() => setCurrentForm('register')} /> : 
                <Register onFormSwitch={() => setCurrentForm('login')} />
              }
            </div>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;