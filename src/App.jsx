import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';

import api from './lib/api'; // Import your API

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<AuthSwitch />} />
          <Route path="/Dashboard" element={<Dashboard api={api} />} />
        </Routes>
      </div>
    </Router>
  );
}

function AuthSwitch() {
  const [currentForm, setCurrentForm] = React.useState('login');
  
  return (
    <div className="w-full max-w-md">
      {currentForm === 'login' ? 
        <Login 
          onFormSwitch={() => setCurrentForm('register')} 
          api={api} 
        /> : 
        <Register 
          onFormSwitch={() => setCurrentForm('login')} 
          api={api} 
        />}
    </div>
  );
}

export default App;