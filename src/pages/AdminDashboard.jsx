// AdminDashboard.jsx - Admin Management Component - COMBINED RESULTS SYSTEM
import React, { useState, useEffect } from 'react';
import { 
  Shield, LogOut, Plus, Calendar, UserCheck, Eye, RefreshCw, 
  Trash2, CheckCircle, XCircle, User, Network, Database, Server
} from 'lucide-react';

const AdminDashboard = ({ api, userData, onLogout }) => {
  const [elections, setElections] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [electionResults, setElectionResults] = useState([]);
  const [hyperledgerResults, setHyperledgerResults] = useState([]);
  const [combinedResults, setCombinedResults] = useState([]); // NEW: Combined results
  const [loadingResults, setLoadingResults] = useState(false);
  const [activeTab, setActiveTab] = useState('elections');
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [selectedElectionForApproval, setSelectedElectionForApproval] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [ganacheAccounts, setGanacheAccounts] = useState([]);
  const [walletStats, setWalletStats] = useState({ total: 0, used: 0, available: 0 });
  
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    election_type: 'presidential',
    custom_election_type: '',
    start_date: '',
    end_date: ''
  });

  const [blockchainStatus, setBlockchainStatus] = useState({
    ethereum: { connected: false, contract: null },
    hyperledger: { connected: false, network: null }
  });

  useEffect(() => {
    fetchAdminData();
    checkBlockchainStatus();
  }, []);

  useEffect(() => {
    if (activeTab === 'results') {
      fetchAllResults();
    }
  }, [activeTab]);

  const checkBlockchainStatus = async () => {
    try {
      // Check Ethereum
      const ethResponse = await api.getContractAddress();
      setContractAddress(ethResponse.data.contract_address || '');
      
      // Check Ganache accounts
      try {
        const ganacheRes = await api.getGanacheAccounts();
        setGanacheAccounts(ganacheRes.data.accounts || []);
      } catch (error) {
        console.log('Ganache not connected');
        setGanacheAccounts([]);
      }

      // Check wallet stats
      try {
        const response = await api.get('/auth/available-accounts/');
        setWalletStats({
          total: response.data.total_accounts || 0,
          used: response.data.used_accounts || 0,
          available: response.data.available_count || 0
        });
      } catch (error) {
        console.log('Could not fetch wallet stats');
      }

      // Check Hyperledger status
      try {
        await api.checkHyperledgerVoteStatus();
        setBlockchainStatus({
          ethereum: { 
            connected: !!ethResponse.data.contract_address,
            contract: ethResponse.data.contract_address 
          },
          hyperledger: { connected: true, network: 'mychannel' }
        });
      } catch (hlfError) {
        setBlockchainStatus({
          ethereum: { 
            connected: !!ethResponse.data.contract_address,
            contract: ethResponse.data.contract_address 
          },
          hyperledger: { connected: false, network: null }
        });
      }
    } catch (error) {
      console.log('Blockchain status check failed:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch elections
      const electionsRes = await api.getElections();
      setElections(electionsRes.data.elections || []);

      // Fetch pending users
      const pendingRes = await api.getPendingUsers();
      setPendingUsers(pendingRes.data.pending_users || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  // NEW: Function to combine results from both blockchains
  const combineBlockchainResults = (ethResults, hlfResults) => {
    const candidateMap = new Map();
    
    // Process Ethereum results
    ethResults.forEach(result => {
      const key = result.name.toLowerCase().trim();
      candidateMap.set(key, {
        name: result.name,
        email: result.email,
        ethereum_votes: result.vote_count || 0,
        hyperledger_votes: 0,
        total_votes: result.vote_count || 0,
        blockchain_id: result.blockchain_id,
        election_type: result.election_type
      });
    });
    
    // Process Hyperledger results and merge
    hlfResults.forEach(result => {
      const key = result.name.toLowerCase().trim();
      if (candidateMap.has(key)) {
        // Candidate exists in both blockchains
        const existing = candidateMap.get(key);
        existing.hyperledger_votes = result.votes || 0;
        existing.total_votes = existing.ethereum_votes + existing.hyperledger_votes;
      } else {
        // Candidate only exists in Hyperledger
        candidateMap.set(key, {
          name: result.name,
          email: null,
          ethereum_votes: 0,
          hyperledger_votes: result.votes || 0,
          total_votes: result.votes || 0,
          blockchain_id: null,
          election_type: null
        });
      }
    });
    
    // Convert map to array and sort by total votes
    return Array.from(candidateMap.values()).sort((a, b) => b.total_votes - a.total_votes);
  };

  // ENHANCED fetchAllResults function with combined results
  const fetchAllResults = async () => {
    try {
      setLoadingResults(true);
      
      console.log('🔍 Fetching all election results...');
      
      const allElectionsResponse = await api.getElections();
      const allElections = allElectionsResponse.data.elections || [];
      
      console.log('📋 All elections found:', allElections.map(e => `${e.title} (ID: ${e.id})`));
      
      let allEthereumResults = [];
      let allHyperledgerResults = [];
      
      for (const election of allElections) {
        // Try Ethereum results
        try {
          console.log(`🔍 Checking Ethereum results for: ${election.title} (ID: ${election.id})`);
          const ethResponse = await api.getElectionResults(election.id);
          if (ethResponse.data && ethResponse.data.results && ethResponse.data.results.length > 0) {
            const resultsWithElection = ethResponse.data.results.map(result => ({
              ...result,
              election_title: election.title,
              election_id: election.id,
              source: 'ethereum'
            }));
            allEthereumResults = [...allEthereumResults, ...resultsWithElection];
            console.log(`✅ Found ${ethResponse.data.results.length} Ethereum results for ${election.title}`);
          }
        } catch (error) {
          console.log(`❌ Ethereum error for ${election.title}:`, error.response?.data || error.message);
        }
        
        // Try Hyperledger results
        try {
          console.log(`🔍 Checking Hyperledger results for: ${election.title} (ID: ${election.id})`);
          
          const hlfResponse = await api.getHyperledgerResults(election.id);
          
          console.log(`📊 FULL Hyperledger response for ${election.title}:`, JSON.stringify(hlfResponse.data, null, 2));
          
          if (hlfResponse.data && hlfResponse.data.success && hlfResponse.data.results) {
            const results = hlfResponse.data.results;
            
            console.log(`🔍 Results object structure:`, Object.keys(results));
            console.log(`🔍 Full results object:`, JSON.stringify(results, null, 2));
            
            // Handle multiple possible response formats
            let candidates = [];
            
            if (results.candidates && Array.isArray(results.candidates)) {
              candidates = results.candidates;
              console.log(`✅ Found candidates array with ${candidates.length} items`);
            } else if (Array.isArray(results)) {
              candidates = results;
              console.log(`✅ Results is directly an array with ${candidates.length} items`);
            } else if (results.voteResults && Array.isArray(results.voteResults)) {
              candidates = results.voteResults;
              console.log(`✅ Found voteResults array with ${candidates.length} items`);
            } else if (results.candidateVotes) {
              // Handle object format: {"candidate1": 5, "candidate2": 3}
              candidates = Object.entries(results.candidateVotes).map(([name, votes]) => ({
                name: name,
                votes: votes,
                id: name
              }));
              console.log(`✅ Found candidateVotes object, converted to ${candidates.length} candidates`);
            } else {
              // Try to find any array in the results object
              for (const [key, value] of Object.entries(results)) {
                if (Array.isArray(value) && value.length > 0) {
                  candidates = value;
                  console.log(`✅ Found array in ${key} with ${candidates.length} items`);
                  break;
                }
              }
            }
            
            console.log(`🎯 Final candidates array:`, JSON.stringify(candidates, null, 2));
            
            if (candidates.length > 0) {
              const resultsWithElection = candidates.map(result => ({
                ...result,
                election_title: election.title,
                election_id: election.id,
                source: 'hyperledger'
              }));
              allHyperledgerResults = [...allHyperledgerResults, ...resultsWithElection];
              console.log(`✅ Added ${candidates.length} Hyperledger results for ${election.title}`);
            } else {
              console.log(`⚠️ No candidates found in Hyperledger results for ${election.title}`);
            }
          } else {
            console.log(`ℹ️ Invalid Hyperledger response structure for ${election.title}`);
          }
        } catch (error) {
          console.log(`❌ Hyperledger error for ${election.title}:`, error.response?.data || error.message);
        }
      }
      
      console.log('📊 FINAL RESULTS SUMMARY:');
      console.log(`- Ethereum results: ${allEthereumResults.length} candidates`);
      console.log(`- Hyperledger results: ${allHyperledgerResults.length} candidates`);
      
      if (allHyperledgerResults.length > 0) {
        console.log(`🎯 Hyperledger candidates:`, allHyperledgerResults.map(c => `${c.name}: ${c.votes} votes`));
      }
      
      // NEW: Create combined results
      const combined = combineBlockchainResults(allEthereumResults, allHyperledgerResults);
      console.log('🔥 COMBINED RESULTS:', combined);
      
      setElectionResults(allEthereumResults);
      setHyperledgerResults(allHyperledgerResults);
      setCombinedResults(combined); // NEW: Set combined results
      
    } catch (error) {
      console.error('❌ Failed to fetch results:', error);
      alert('Failed to fetch results. Check console for details.');
    } finally {
      setLoadingResults(false);
    }
  };

  const createHyperledgerElection = async () => {
    try {
      const response = await api.createHyperledgerElection({
        title: 'Test Hyperledger Election',
        description: 'Test election on Hyperledger Fabric',
        start_time: Math.floor(Date.now() / 1000),
        end_time: Math.floor(Date.now() / 1000) + 86400
      });

      if (response.data.success) {
        alert('Hyperledger election created successfully!');
        await fetchAllResults();
      } else {
        alert('Failed to create Hyperledger election');
      }
    } catch (error) {
      console.error('Hyperledger election creation failed:', error);
      alert(`Hyperledger election creation failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createElection(newElection);
      console.log('✅ Election created:', response.data);
      
      setNewElection({
        title: '',
        description: '',
        election_type: 'presidential',
        custom_election_type: '',
        start_date: '',
        end_date: ''
      });
      setShowCreateElection(false);
      
      await fetchAdminData();
      alert('Election created successfully!');
    } catch (error) {
      console.error('❌ Failed to create election:', error);
      if (error.response?.data?.custom_election_type) {
        alert('Please enter a custom election type name.');
      } else {
        alert('Failed to create election. Please try again.');
      }
    }
  };

  const handleDeleteElection = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      try {
        await api.deleteElection(electionId);
        await fetchAdminData();
        alert('Election deleted successfully!');
      } catch (error) {
        console.error('❌ Failed to delete election:', error);
        alert('Failed to delete election. It may have existing votes.');
      }
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await api.approveUser(userId, selectedElectionForApproval || null);
      await fetchAdminData();
      alert('User approved successfully!');
      setSelectedElectionForApproval('');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleRejectUser = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await api.rejectUser(userId);
        await fetchAdminData();
        alert('User rejected successfully!');
      } catch (error) {
        console.error('Error rejecting user:', error);
        alert('Failed to reject user. Please try again.');
      }
    }
  };

  const handleQuickFix = async () => {
    try {
      console.log('🔄 Starting quick fix...');
      const response = await api.refreshContract();
      setContractAddress(response.data.contract_address);
      
      await fetchAdminData();
      await checkBlockchainStatus();
      
      setTimeout(() => {
        fetchAllResults();
      }, 2000);
      
      alert(`✅ System fixed! Contract: ${response.data.contract_address.slice(0, 10)}...`);
    } catch (error) {
      console.error('❌ Quick fix failed:', error);
      alert('Quick fix failed - check console for details');
    }
  };

  // Blockchain Status Component
  const BlockchainStatus = () => (
    <div className="p-6 bg-gray-50 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Network className={ganacheAccounts.length > 0 ? 'text-green-600' : 'text-red-600'} size={24} />
          <div>
            <h3 className="font-medium text-gray-800">Dual Blockchain System Status</h3>
            <p className="text-sm text-gray-600">
              {ganacheAccounts.length > 0 
                ? `Ganache: Connected | Elections: ${elections.length} | Wallets: ${walletStats.available} available`
                : 'Ganache: Not connected - Please start Ganache CLI'
              }
            </p>
          </div>
        </div>
        {ganacheAccounts.length > 0 && (
          <div className="flex space-x-2">
            <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              contractAddress 
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Network size={16} />
              <span>{contractAddress ? 'Blockchain Ready' : 'Will Auto-Deploy'}</span>
            </div>
            
            <button
              onClick={createHyperledgerElection}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Server size={16} />
              <span>Create HLF Election</span>
            </button>
          </div>
        )}
      </div>

      {/* Dual Blockchain Status */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className={`p-4 rounded-xl border ${
          blockchainStatus.ethereum.connected 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Database className={`${
              blockchainStatus.ethereum.connected ? 'text-blue-600' : 'text-red-600'
            }`} size={20} />
            <div>
              <h4 className="font-medium text-gray-800">Ethereum</h4>
              <p className={`text-xs ${
                blockchainStatus.ethereum.connected ? 'text-blue-600' : 'text-red-600'
              }`}>
                {blockchainStatus.ethereum.connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          {blockchainStatus.ethereum.contract && (
            <p className="text-xs text-gray-500 mt-1">
              {blockchainStatus.ethereum.contract.slice(0, 10)}...
            </p>
          )}
        </div>
        
        <div className={`p-4 rounded-xl border ${
          blockchainStatus.hyperledger.connected 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <Server className={`${
              blockchainStatus.hyperledger.connected ? 'text-green-600' : 'text-red-600'
            }`} size={20} />
            <div>
              <h4 className="font-medium text-gray-800">Hyperledger</h4>
              <p className={`text-xs ${
                blockchainStatus.hyperledger.connected ? 'text-green-600' : 'text-red-600'
              }`}>
                {blockchainStatus.hyperledger.connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          {blockchainStatus.hyperledger.network && (
            <p className="text-xs text-gray-500 mt-1">
              Channel: {blockchainStatus.hyperledger.network}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-6xl mx-auto">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 relative">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="mr-3" size={32} />
                Dual Blockchain Admin Dashboard
              </h2>
              <p className="text-red-100">
                Manage elections on Ethereum & Hyperledger Fabric
              </p>
            </div>
            
            <button 
              onClick={onLogout}
              className="bg-white text-red-600 hover:bg-red-50 py-2 px-4 rounded-full flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <BlockchainStatus />

        {/* Admin Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab('elections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'elections'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Elections ({elections.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Users ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Combined Results
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Elections Management Tab */}
          {activeTab === 'elections' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Elections Management</h3>
                <button
                  onClick={() => setShowCreateElection(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Create Election</span>
                </button>
              </div>

              {elections.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No elections created yet</p>
                  <p className="text-gray-500 text-sm mt-2">Create your first election to get started</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {elections.map((election) => (
                    <div key={election.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-800 text-lg">{election.title}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              election.is_active 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {election.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {election.election_type_display}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{election.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p><strong>Start:</strong> {new Date(election.start_date).toLocaleDateString()}</p>
                            <p><strong>End:</strong> {new Date(election.end_date).toLocaleDateString()}</p>
                            <p><strong>Candidates:</strong> {election.candidate_count} | <strong>Voters:</strong> {election.voter_count}</p>
                            {election.blockchain_id && (
                              <p><strong>Blockchain ID:</strong> {election.blockchain_id}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteElection(election.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-all"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Users Tab */}
          {activeTab === 'pending' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Pending User Registrations</h3>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending registrations</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <User size={24} className="text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{user.username || user.email}</h4>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {user.is_candidate && user.is_elector ? 'Candidate & Elector' : 
                               user.is_candidate ? 'Candidate' : 
                               user.is_elector ? 'Elector' : 'Voter'}
                            </span>
                            {user.selected_election_details && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.selected_election_details.title} ({user.selected_election_details.election_type_display})
                              </span>
                            )}
                          </div>
                          
                          {!user.selected_election_details && (
                            <div className="mt-3">
                              <select
                                value={selectedElectionForApproval}
                                onChange={(e) => setSelectedElectionForApproval(e.target.value)}
                                className="text-sm px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="">Assign to election...</option>
                                {elections.filter(e => e.is_active).map(election => (
                                  <option key={election.id} value={election.id}>
                                    {election.title} ({election.election_type_display})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectUser(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NEW: Combined Results Tab */}
          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Combined Blockchain Results</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={fetchAllResults}
                    disabled={loadingResults}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    {loadingResults ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        <span>Refresh All Results</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {loadingResults ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading combined blockchain results...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Combined Results - Main Feature */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Database className="text-blue-600" size={20} />
                        <Server className="text-green-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Final Combined Results</h4>
                        <p className="text-sm text-purple-600">Ethereum + Hyperledger votes combined</p>
                      </div>
                    </div>
                    
                    {combinedResults && combinedResults.length > 0 ? (
                      <div className="space-y-3">
                        {combinedResults.map((result, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                    index === 0 ? 'bg-yellow-500' : 
                                    index === 1 ? 'bg-gray-400' : 
                                    index === 2 ? 'bg-amber-600' : 'bg-purple-600'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-800">{result.name}</h5>
                                    {result.email && <p className="text-xs text-gray-500">{result.email}</p>}
                                  </div>
                                </div>
                                
                                {/* Vote breakdown */}
                                <div className="mt-2 flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Database size={12} className="text-blue-600" />
                                    <span className="text-blue-600">{result.ethereum_votes} ETH</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Server size={12} className="text-green-600" />
                                    <span className="text-green-600">{result.hyperledger_votes} HLF</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-3xl font-bold text-purple-600">
                                  {result.total_votes}
                                </div>
                                <p className="text-xs text-gray-500">total votes</p>
                                <div className="text-xs text-purple-600 mt-1">
                                  {result.total_votes > 0 ? 
                                    `${((result.total_votes / combinedResults.reduce((sum, r) => sum + r.total_votes, 0)) * 100).toFixed(1)}%` : 
                                    '0%'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex justify-center items-center space-x-2 mb-2">
                          <Database size={32} className="text-blue-400" />
                          <Server size={32} className="text-green-400" />
                        </div>
                        <p className="text-purple-600 text-sm">No combined results yet</p>
                        <p className="text-gray-500 text-xs mt-1">Results will appear when votes are cast on either blockchain</p>
                      </div>
                    )}
                  </div>

                  {/* Individual Blockchain Results */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Ethereum Results */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Database className="text-blue-600" size={24} />
                        <div>
                          <h4 className="font-semibold text-gray-800">Ethereum Results</h4>
                          <p className="text-sm text-blue-600">Smart Contract Voting</p>
                        </div>
                      </div>
                      
                      {electionResults && electionResults.length > 0 ? (
                        <div className="space-y-3">
                          {electionResults.map((result, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-800">{result.name}</h5>
                                  {result.email && <p className="text-xs text-gray-500">{result.email}</p>}
                                  <div className="flex items-center space-x-2 mt-1">
                                    {result.election_type && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {result.election_type}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      Ethereum
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {result.vote_count}
                                  </div>
                                  <p className="text-xs text-gray-500">vote{result.vote_count !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Database size={32} className="text-blue-400 mx-auto mb-2" />
                          <p className="text-blue-600 text-sm">No Ethereum results yet</p>
                        </div>
                      )}
                    </div>

                    {/* Hyperledger Results */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Server className="text-green-600" size={24} />
                        <div>
                          <h4 className="font-semibold text-gray-800">Hyperledger Results</h4>
                          <p className="text-sm text-green-600">Fabric Network Voting</p>
                        </div>
                      </div>
                      
                      {hyperledgerResults && hyperledgerResults.length > 0 ? (
                        <div className="space-y-3">
                          {hyperledgerResults.map((result, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-800">{result.name}</h5>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Hyperledger
                                    </span>
                                  </div>
                                  {result.percentage !== undefined && (
                                    <p className="text-xs text-gray-500 mt-1">{result.percentage.toFixed(1)}%</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">
                                    {result.votes}
                                  </div>
                                  <p className="text-xs text-gray-500">vote{result.votes !== 1 ? 's' : ''}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Server size={32} className="text-green-400 mx-auto mb-2" />
                          <p className="text-green-600 text-sm">No Hyperledger results yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Section */}
                  {(electionResults.length > 0 || hyperledgerResults.length > 0 || combinedResults.length > 0) && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Database className="mr-2" size={20} />
                        Fair Voting System Summary
                      </h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{electionResults.length}</div>
                          <p className="text-sm text-gray-600">Ethereum Candidates</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{hyperledgerResults.length}</div>
                          <p className="text-sm text-gray-600">Hyperledger Candidates</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{combinedResults.length}</div>
                          <p className="text-sm text-gray-600">Total Candidates</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {combinedResults.reduce((sum, r) => sum + r.total_votes, 0)}
                          </div>
                          <p className="text-sm text-gray-600">Combined Votes</p>
                        </div>
                      </div>
                      
                      {/* Fair Voting Notice */}
                      <div className="mt-4 p-3 bg-white border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-700">
                          🔒 <strong>Fair Voting System:</strong> Each user can only vote on ONE blockchain. Results are combined to show total votes per candidate.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Election Modal */}
      {showCreateElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Create New Election</h3>
            
            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newElection.title}
                  onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newElection.description}
                  onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Election Type</label>
                <select
                  value={newElection.election_type}
                  onChange={(e) => setNewElection({...newElection, election_type: e.target.value, custom_election_type: ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="presidential">Presidential</option>
                  <option value="parliamentary">Parliamentary</option>
                  <option value="local">Local Government</option>
                  <option value="referendum">Referendum</option>
                  <option value="student">Student Council</option>
                  <option value="corporate">Corporate Board</option>
                  <option value="custom">🆕 Custom Type</option>
                </select>
              </div>
              
              {newElection.election_type === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Election Type Name
                  </label>
                  <input
                    type="text"
                    value={newElection.custom_election_type || ''}
                    onChange={(e) => setNewElection({...newElection, custom_election_type: e.target.value})}
                    placeholder="e.g., University Senate, City Council..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={newElection.start_date}
                  onChange={(e) => setNewElection({...newElection, start_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={newElection.end_date}
                  onChange={(e) => setNewElection({...newElection, end_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateElection(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  Create Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;