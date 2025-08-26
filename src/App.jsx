import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import CreateElection from './pages/CreateElection';
import ElectionDetail from './pages/ElectionDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<AuthSwitch />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elections/create" element={<CreateElection />} />
          <Route path="/elections/:id" element={<ElectionDetail />} />
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
        <Login onFormSwitch={() => setCurrentForm('register')} /> : 
        <Register onFormSwitch={() => setCurrentForm('login')} />}
    </div>
  );
}

export default App;