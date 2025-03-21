import React, { useState } from 'react';

const Login = ({ onFormSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login with:", { email, password });
    // Add your authentication logic here
  }
  
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-500 ease-in-out transform hover:shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
          <svg className="w-16 h-16 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8"> Vote électronique décentralisé</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse mail</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Adresse mail" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe
          </label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="********" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
        Se connecter
        </button>
      </form>
      
      <div className="text-center mt-6 text-gray-600">
      Vous n'avez pas de compte ?
        <button 
          onClick={() => onFormSwitch('register')} 
          className="ml-1 text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300"
        >
          Inscrivez-vous ici
        </button>
      </div>
    </div>
  );
}

export default Login;