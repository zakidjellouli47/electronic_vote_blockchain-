import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.17.163.86:8001',
  withCredentials: true,
  timeout: 10000 // Add timeout
});

// Request interceptor for auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    // If we get a 401, the token is invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      // Only redirect to login if we're not already on the auth page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Enhanced API methods
export default {
  // Auth - Correct paths
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  logout: () => api.post('/api/auth/logout/'),
  verifyAuth: () => api.get('/api/auth/verify-auth/'),

  // Elections - Clean paths after URL structure fix
  createElection: (data) => api.post('/api/elections/', data),
  getElections: () => api.get('/api/elections/'),
  
  // Voting - Clean paths
  castVote: (electionId, candidateId) => api.post(`/api/elections/${electionId}/vote/`, { candidate_id: candidateId }),
  getResults: (electionId) => api.get(`/api/elections/${electionId}/results/`),
  
  // Wallet connection
  connectWallet: (walletAddress) => api.post('/api/auth/connect-wallet/', { wallet_address: walletAddress }),
};