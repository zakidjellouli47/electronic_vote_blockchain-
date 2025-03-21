import React, { useState } from 'react';

const Register = ({ onFormSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register with:", { name, email, password, role });
    // Add your registration logic here
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
      
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Participez au vote</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur          </label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nom d'utilisateur" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
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
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Je souhaite m'inscrire en tant que</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                role === 'candidate' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setRole('candidate')}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === 'candidate' ? 'bg-purple-200' : 'bg-gray-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    role === 'candidate' ? 'text-purple-600' : 'text-gray-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <span className={`font-medium ${
                role === 'candidate' ? 'text-purple-700' : 'text-gray-700'
              }`}>Candidat</span>
            </div>
            
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                role === 'elector' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setRole('elector')}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  role === 'elector' ? 'bg-purple-200' : 'bg-gray-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    role === 'elector' ? 'text-purple-600' : 'text-gray-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className={`font-medium ${
                role === 'elector' ? 'text-purple-700' : 'text-gray-700'
              }`}>Électeur</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
       Inscrire
        </button>
      </form>
      
      <div className="text-center mt-6 text-gray-600">
       Vous avez déjà un compte ?
        <button 
          onClick={() => onFormSwitch('login')} 
          className="ml-1 text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300"
        >
      Connectez-vous ici
        </button>
      </div>
    </div>
  );
}

export default Register;
