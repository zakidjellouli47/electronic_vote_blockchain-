import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Register = ({ onFormSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

 // src/Register.js
const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  try {
    const response = await api.post('register/', formData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user_id', response.data.user_id);
    localStorage.setItem('email', response.data.email);
    navigate('/dashboard');
  } catch (err) {
    const errorData = err.response?.data;
    if (errorData) {
      // Handle field-specific errors from Django
      const errorMessages = Object.entries(errorData)
        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(' ') : errors}`)
        .join('\n');
      setError(errorMessages);
    } else {
      setError('Registration failed. Please try again.');
    }
    console.error('Registration error:', err);
  }
};

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Register</h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})}
          className="w-full p-2 border rounded"
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})}
          className="w-full p-2 border rounded"
          placeholder="Password"
          required
        />
        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 p-2 border rounded ${formData.role === 'candidate' ? 'bg-purple-100' : ''}`}
            onClick={() => setFormData({...formData, role: 'candidate'})}
          >
            Candidate
          </button>
          <button
            type="button"
            className={`flex-1 p-2 border rounded ${formData.role === 'elector' ? 'bg-purple-100' : ''}`}
            onClick={() => setFormData({...formData, role: 'elector'})}
          >
            Elector
          </button>
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">
          Register
        </button>
      </form>
      <button onClick={onFormSwitch} className="mt-4 text-purple-600">
        Already have an account? Login
      </button>
    </div>
  );
};

export default Register;