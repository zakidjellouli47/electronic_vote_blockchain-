import React, { useState } from 'react';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4 bg-opacity-75" 
         style={{ backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      <div className="w-full max-w-md transition-all duration-500 ease-in-out">
        {currentForm === 'login' ? 
          <Login onFormSwitch={toggleForm} /> : 
          <Register onFormSwitch={toggleForm} />}
      </div>
    </div>
  );
}

export default App;