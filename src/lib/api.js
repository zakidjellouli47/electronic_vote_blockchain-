// Complete Updated API Configuration - WITH HYPERLEDGER INTEGRATION - FIXED DYNAMIC
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.17.163.86:8001',
  withCredentials: true,
  timeout: 10000
});

// Request interceptor for auth token
api.interceptors.request.use(
  config => {
    const isAuthEndpoint = config.url.includes('/auth/register/') || 
                          config.url.includes('/auth/login/') ||
                          config.url.includes('/auth/elections/available/');
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default {
  // Generic HTTP methods
  get: (endpoint) => api.get(endpoint),
  post: (endpoint, data) => api.post(endpoint, data),
  put: (endpoint, data) => api.put(endpoint, data),
  delete: (endpoint) => api.delete(endpoint),

  // Auth endpoints
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => api.post('/api/auth/register/', userData),
  logout: () => api.post('/api/auth/logout/'),
  verifyAuth: () => api.get('/api/auth/verify-auth/'),
  
  // Election management endpoints
  getElections: () => api.get('/api/auth/elections/'),
  getAvailableElections: () => api.get('/api/auth/elections/available/'),
  createElection: (electionData) => api.post('/api/auth/elections/create/', electionData),
  updateElection: (electionId, electionData) => api.put(`/api/auth/elections/${electionId}/update/`, electionData),
  deleteElection: (electionId) => api.delete(`/api/auth/elections/${electionId}/delete/`),
  
  // Candidate management
  getCandidates: (electionId = null) => {
    const params = electionId ? `?election_id=${electionId}` : '';
    return api.get(`/api/auth/candidates/${params}`);
  },
  
  // Ganache and wallet endpoints
  getGanacheAccounts: () => api.get('/api/auth/ganache-accounts/'),
  connectWallet: (walletAddress) => api.post('/api/auth/connect-wallet/', { wallet_address: walletAddress }),
  assignGanacheAddress: (userId) => api.post('/api/auth/assign-ganache-address/', { user_id: userId }),
  getAvailableAccounts: () => api.get('/api/auth/available-accounts/'),
  
  // Admin endpoints
  getPendingUsers: () => api.get('/api/auth/pending-users/'),
  getApprovedUsers: () => api.get('/api/auth/approved-users/'),
  approveUser: (userId, electionId = null) => {
    const data = electionId ? { election_id: electionId } : {};
    return api.post(`/api/auth/approve-user/${userId}/`, data);
  },
  rejectUser: (userId) => api.post(`/api/auth/reject-user/${userId}/`),

  // Blockchain endpoints
  getContractAddress: () => api.get('/api/auth/contract-address/'),
  
  // Election and voting endpoints
  getElectionResults: (electionId = null) => {
    const params = electionId ? `?election_id=${electionId}` : '';
    return api.get(`/api/auth/election-results/${params}`);
  },
  
  // =============================================
  // ETHEREUM VOTING (your existing methods)
  // =============================================
  
  // Ethereum voting endpoint
  castVote: (candidateBlockchainId, voterWallet) => {
    console.log('📤 API CALL: Ethereum vote with blockchain candidate ID:', candidateBlockchainId);
    return api.post('/api/auth/vote/', { 
      candidate_id: candidateBlockchainId,  // This is the blockchain ID (1, 2, 3...)
      voter_wallet: voterWallet 
    });
  },

  // Vote status endpoint
  checkUserVoteStatus: () => api.get('/api/auth/check-vote-status/'),

  // Quick fix endpoint
  refreshContract: () => api.post('/api/auth/refresh-contract/'),

  // =============================================
  // HYPERLEDGER FABRIC VOTING - FIXED DYNAMIC
  // =============================================
  
  // Hyperledger voting endpoints - NOW DYNAMIC LIKE ETHEREUM
  castHyperledgerVote: (candidateBlockchainId, voterWallet) => {
    console.log('📤 API CALL: Hyperledger vote for candidate:', candidateBlockchainId);
    return api.post('/api/auth/hyperledger/cast-vote/', { 
      candidate_id: candidateBlockchainId,
      voter_wallet: voterWallet
      // REMOVED: election_id: '1' - Now uses user's selected election dynamically
    });
  },

  // Dual blockchain voting (both Ethereum + Hyperledger) - FIXED DYNAMIC
  castDualVote: (candidateBlockchainId, voterWallet) => {
    console.log('📤 API CALL: Dual blockchain vote for candidate:', candidateBlockchainId);
    return api.post('/api/auth/dual/cast-vote/', { 
      candidate_id: candidateBlockchainId,
      voter_wallet: voterWallet
      // REMOVED: election_id: '1' - Now uses user's selected election dynamically
    });
  },

  // Hyperledger election management
  createHyperledgerElection: (electionData) => {
    return api.post('/api/auth/hyperledger/create-election/', electionData);
  },

  addHyperledgerCandidate: (candidateData) => {
    return api.post('/api/auth/hyperledger/add-candidate/', candidateData);
  },

  // Get Hyperledger results - FIXED DYNAMIC
  getHyperledgerResults: (electionId = null) => {
    // If no electionId provided, backend will use user's selected election
    const url = electionId ? 
      `/api/auth/hyperledger/election-results/${electionId}/` : 
      '/api/auth/hyperledger/election-results/';
    return api.get(url);
  },

  // Check Hyperledger vote status - FIXED DYNAMIC
  checkHyperledgerVoteStatus: (electionId = null) => {
    // If no electionId provided, backend will use user's selected election
    const params = electionId ? `?election_id=${electionId}` : '';
    return api.get(`/api/auth/hyperledger/check-vote-status/${params}`);
  },


  updateEthereumVote: (candidateId) => {
    console.log('📤 Update Ethereum vote to candidate:', candidateId);
    return api.post('/api/auth/ethereum/update-vote/', { 
      candidate_id: candidateId
    });
  },

  updateHyperledgerVote: (candidateId) => {
    console.log('📤 Update Hyperledger vote to candidate:', candidateId);
    return api.post('/api/auth/hyperledger/update-vote/', { 
      candidate_id: candidateId
    });
  },

  getCurrentVotes: () => {
    console.log('📤 Get current votes');
    return api.get('/api/auth/current-votes/');
  }
};