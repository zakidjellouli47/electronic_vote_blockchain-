import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4" 
           style={{ backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        <Routes>
          <Route path="/" element={<AuthPages />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

function AuthPages() {
  const [currentForm, setCurrentForm] = React.useState('login');
  
  return (
    <div className="w-full max-w-md transition-all duration-500 ease-in-out">
      {currentForm === 'login' ? 
        <Login onFormSwitch={() => setCurrentForm('register')} /> : 
        <Register onFormSwitch={() => setCurrentForm('login')} />}
    </div>
  );
}

export default App;