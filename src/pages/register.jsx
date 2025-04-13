import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const Register = ({ onFormSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    try {
      const response = await api.post('register/', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('email', response.data.email);
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

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
      
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Join VoteChain</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            id="username" 
            value={formData.username}
            onChange={handleChange}
            placeholder="John Doe" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="youremail@example.com" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            id="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="********" 
            className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">I want to register as</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                formData.role === 'candidate' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setFormData({...formData, role: 'candidate'})}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  formData.role === 'candidate' ? 'bg-purple-200' : 'bg-gray-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    formData.role === 'candidate' ? 'text-purple-600' : 'text-gray-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <span className={`font-medium ${
                formData.role === 'candidate' ? 'text-purple-700' : 'text-gray-700'
              }`}>Candidate</span>
            </div>
            
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                formData.role === 'elector' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setFormData({...formData, role: 'elector'})}
            >
              <div className="flex justify-center mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  formData.role === 'elector' ? 'bg-purple-200' : 'bg-gray-100'
                }`}>
                  <svg className={`w-6 h-6 ${
                    formData.role === 'elector' ? 'text-purple-600' : 'text-gray-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <span className={`font-medium ${
                formData.role === 'elector' ? 'text-purple-700' : 'text-gray-700'
              }`}>Elector</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          Register
        </button>
      </form>
      
      <div className="text-center mt-6 text-gray-600">
        Already have an account? 
        <button 
          onClick={() => onFormSwitch('login')} 
          className="ml-1 text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300"
        >
          Login here
        </button>
      </div>
    </div>
  );
};

export default Register;