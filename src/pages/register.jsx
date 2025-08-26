import React, { useState, useEffect } from 'react';

const Register = ({ onFormSwitch, api, navigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    selected_election: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canBeElector, setCanBeElector] = useState(false);
  const [availableElections, setAvailableElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);

  // Fetch available elections on component mount
  useEffect(() => {
    fetchAvailableElections();
  }, []);

  const fetchAvailableElections = async () => {
    try {
      setLoadingElections(true);
      const response = await api.getAvailableElections();
      setAvailableElections(response.data.elections || []);
      console.log('📋 Available elections:', response.data.elections);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
      setError('Failed to load available elections');
    } finally {
      setLoadingElections(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({...formData, role: selectedRole});
    // Reset elector checkbox when role changes
    if (selectedRole !== 'candidate') {
      setCanBeElector(false);
    }
  };

  const handleElectionChange = (e) => {
    setFormData({...formData, selected_election: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!formData.role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    if (!formData.selected_election) {
      setError('Please select an election to participate in');
      setIsLoading(false);
      return;
    }

    // Convert role to the format your serializer expects
    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      is_candidate: formData.role === 'candidate',
      is_elector: formData.role === 'elector' || canBeElector,
      is_admin: false, // Never allow admin registration through UI
      wallet_address: '',
      verified: false,
      approved: false, // Users start unapproved
      selected_election: parseInt(formData.selected_election)
    };

    try {
      const response = await api.register(registrationData);
      console.log('Registration successful:', response.data);
      
      // Don't store token or redirect immediately - user needs approval
      setError('');
      
      // Show success message with election info
      const selectedElection = availableElections.find(e => e.id === parseInt(formData.selected_election));
      alert(`Registration successful! You have been registered for "${selectedElection?.title}" election. Please wait for admin approval before you can access your dashboard.`);
      onFormSwitch('login');
      
    } catch (err) {
      console.error('Registration error:', err);
      const errors = err.response?.data;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(' ');
        setError(errorMessages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingElections) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-500 ease-in-out transform hover:shadow-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading available elections...</p>
        </div>
      </div>
    );
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        {/* Election Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Election to Participate In</label>
          {availableElections.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-700 font-medium">No active elections available</p>
              <p className="text-yellow-600 text-sm mt-1">Please contact an administrator to create elections</p>
            </div>
          ) : (
            <select
              value={formData.selected_election}
              onChange={handleElectionChange}
              className="w-full px-4 py-3 rounded-full border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors duration-300"
              required
              disabled={isLoading}
            >
              <option value="">Choose an election...</option>
              {availableElections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title} ({election.election_type.charAt(0).toUpperCase() + election.election_type.slice(1)})
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">I want to register as</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                formData.role === 'candidate' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isLoading && handleRoleChange('candidate')}
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
              <p className="text-xs text-gray-500 mt-1">Run for office in elections</p>
            </div>
            
            <div 
              className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 text-center ${
                formData.role === 'elector' 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isLoading && handleRoleChange('elector')}
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
              <p className="text-xs text-gray-500 mt-1">Vote in elections</p>
            </div>
          </div>
        </div>

        {/* Additional option for candidates to also be electors */}
        {formData.role === 'candidate' && (
          <div className="bg-purple-50 rounded-2xl p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={canBeElector}
                onChange={(e) => setCanBeElector(e.target.checked)}
                disabled={isLoading}
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-purple-700">
                I also want to be able to vote in elections (Elector)
              </span>
            </label>
            <p className="text-xs text-purple-600 mt-2 ml-8">
              This allows you to both run for office and vote in other elections
            </p>
          </div>
        )}

        {/* Election Info Display */}
        {formData.selected_election && (
          <div className="bg-blue-50 rounded-2xl p-4">
            {(() => {
              const selectedElection = availableElections.find(e => e.id === parseInt(formData.selected_election));
              return selectedElection ? (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">Selected Election:</h4>
                  <p className="text-blue-600 text-sm"><strong>Title:</strong> {selectedElection.title}</p>
                  <p className="text-blue-600 text-sm"><strong>Type:</strong> {selectedElection.election_type.charAt(0).toUpperCase() + selectedElection.election_type.slice(1)}</p>
                  <p className="text-blue-600 text-sm"><strong>Start:</strong> {new Date(selectedElection.start_date).toLocaleDateString()}</p>
                  <p className="text-blue-600 text-sm"><strong>End:</strong> {new Date(selectedElection.end_date).toLocaleDateString()}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading || availableElections.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="text-center mt-6 text-gray-600">
        Already have an account? 
        <button 
          onClick={() => onFormSwitch('login')} 
          disabled={isLoading}
          className="ml-1 text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login here
        </button>
      </div>
    </div>
  );
};

export default Register;