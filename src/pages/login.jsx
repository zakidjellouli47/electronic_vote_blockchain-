import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onFormSwitch }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('login/', formData);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-8">Login</h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded">
          Login
        </button>
      </form>
      <button onClick={onFormSwitch} className="mt-4 text-purple-600">
        Need an account? Register
      </button>
    </div>
  );
};

export default Login;