// src/pages/VoteDashboard.jsx - VOTE ONCE, EDIT ONLY - NO RE-VOTING - FAIR VOTING SYSTEM
import React, { useState, useEffect } from 'react';
import { 
  Award, Users, User, Vote, Wallet, LogOut, Calendar, 
  CheckCircle, Database, Server, GitBranch, Layers, Settings,
  Network, Clock, Activity, Shield, AlertCircle, RefreshCw, Edit, X
} from 'lucide-react';

const VoteDashboard = ({ api, userData, onLogout }) => {
  const [candidates, setCandidates] = useState([]);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [votingFor, setVotingFor] = useState(null);
  
  // Vote status state
  const [userVoteStatus, setUserVoteStatus] = useState({ 
    has_voted: false, 
    can_vote: false,
    blockchain_status: { ethereum: false, hyperledger: false, type: null }
  });
  
  // Current votes state
  const [currentVotes, setCurrentVotes] = useState({ 
    ethereum_vote: null, 
    hyperledger_vote: null 
  });
  
  // Update vote state
  const [updatingVote, setUpdatingVote] = useState(null);
  
  const [walletStats, setWalletStats] = useState({ total: 0, used: 0, available: 0 });
  const [votingMode, setVotingMode] = useState('ethereum');
  const [showVotingModeSelector, setShowVotingModeSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [blockchainStatus, setBlockchainStatus] = useState({
    ethereum: { connected: false, contract: null },
    hyperledger: { connected: false, network: null }
  });

  useEffect(() => {
    fetchVoterData();
    checkBlockchainStatus();
  }, []);

  useEffect(() => {
    if (userData?.approved) {
      fetchCandidatesAndStatus();
      fetchCurrentVotes();
    }
  }, [userData]);

  const checkBlockchainStatus = async () => {
    try {
      const ethResponse = await api.getContractAddress();
      
      let hyperledgerConnected = false;
      try {
        await api.checkHyperledgerVoteStatus();
        hyperledgerConnected = true;
      } catch (hlfError) {
        console.log('Hyperledger not available');
      }
      
      setBlockchainStatus({
        ethereum: { 
          connected: !!ethResponse.data.contract_address,
          contract: ethResponse.data.contract_address 
        },
        hyperledger: { connected: hyperledgerConnected, network: 'mychannel' }
      });
    } catch (error) {
      console.log('Blockchain status check failed:', error);
    }
  };

  const fetchVoterData = async () => {
    try {
      await fetchAvailableAccounts();
    } catch (error) {
      console.error('Failed to fetch voter data:', error);
    }
  };

  const fetchCandidatesAndStatus = async () => {
    if (userData?.approved) {
      try {
        const candidatesRes = await api.getCandidates();
        const rawCandidates = candidatesRes.data.candidates || [];
        
        const candidatesWithBlockchainId = rawCandidates.map((candidate, index) => ({
          ...candidate,
          blockchain_id: index + 1,
          database_id: candidate.id
        }));
        
        setCandidates(candidatesWithBlockchainId);
        
        if (userData.wallet_address) {
          await checkUserVoteStatus();
        }
        
        await fetchAvailableAccounts();
        
      } catch (error) {
        console.log('No candidates available:', error);
      }
    }
  };

  const fetchCurrentVotes = async () => {
    try {
      const response = await api.getCurrentVotes();
      setCurrentVotes(response.data);
      console.log('📊 Current votes:', response.data);
    } catch (error) {
      console.log('Could not fetch current votes:', error);
    }
  };

  const checkUserVoteStatus = async () => {
    try {
      const response = await api.checkUserVoteStatus();
      setUserVoteStatus(response.data);
      console.log('🗳️ Vote status:', response.data);
    } catch (error) {
      console.log('Could not check vote status:', error);
    }
  };

  const fetchAvailableAccounts = async () => {
    try {
      const response = await api.get('/api/auth/available-accounts/');
      const data = response.data;
      
      setAvailableAccounts(data.available_accounts || []);
      setWalletStats({
        total: data.total_accounts || 0,
        used: data.used_accounts || 0,
        available: data.available_count || 0
      });
      
    } catch (error) {
      console.log('Could not fetch available accounts:', error);
      setAvailableAccounts([]);
    }
  };

  const connectGanacheWallet = async () => {
    if (!selectedAccount) {
      alert('Please select a Ganache account');
      return;
    }
    
    try {
      const response = await api.connectWallet(selectedAccount);
      
      if (response.data.collision) {
        alert(`⚠️ Address already in use by: ${response.data.used_by}`);
        await fetchAvailableAccounts();
        setSelectedAccount('');
        return;
      }
      
      userData.wallet_address = selectedAccount;
      alert('✅ Ganache wallet connected successfully!');
      
      await fetchAvailableAccounts();
      setTimeout(() => {
        checkUserVoteStatus();
        fetchCurrentVotes();
      }, 1000);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('❌ Failed to connect wallet. Please try again.');
    }
  };

  const assignGanacheAddress = async () => {
    try {
      const response = await api.assignGanacheAddress(userData.id);
      userData.wallet_address = response.data.wallet_address;
      
      alert('Ganache address assigned successfully! You can now vote.');
      
      await fetchAvailableAccounts();
      setTimeout(() => {
        checkUserVoteStatus();
        fetchCurrentVotes();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to assign Ganache address:', error);
      alert('Failed to assign Ganache address. Please try again.');
    }
  };

  // ORIGINAL VOTE FUNCTION (Only for first-time voting)
  const handleVote = async (candidateBlockchainId) => {
    try {
      setLoading(true);
      console.log(`=== FIRST VOTE ON ${votingMode.toUpperCase()} ===`);
      console.log('Candidate ID:', candidateBlockchainId);
      
      if (!candidateBlockchainId || !userData.wallet_address) {
        alert('Missing candidate ID or wallet address.');
        return;
      }
      
      setVotingFor(null);
      
      let response;
      if (votingMode === 'ethereum') {
        response = await api.castVote(candidateBlockchainId, userData.wallet_address);
      } else if (votingMode === 'hyperledger') {
        response = await api.castHyperledgerVote(candidateBlockchainId, userData.wallet_address);
      } else {
        response = await api.castDualVote(candidateBlockchainId, userData.wallet_address);
      }
      
      const successMessage = response.data.message || `${votingMode.toUpperCase()} vote successful!`;
      alert(successMessage + ' You can now only UPDATE your vote, no new voting allowed.');
      
      await fetchCurrentVotes();
      await checkUserVoteStatus();
      
    } catch (error) {
      console.error('Voting failed:', error);
      
      if (error.response?.data?.error?.includes('already voted')) {
        alert('You have already voted in this election.');
        await fetchCurrentVotes();
        await checkUserVoteStatus();
      } else {
        const errorMsg = error.response?.data?.error || error.message || 'Please try again.';
        alert(`Failed to cast ${votingMode} vote: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // UPDATE VOTE FUNCTION
  const handleUpdateVote = async (blockchain, candidateId) => {
    try {
      setLoading(true);
      console.log(`=== UPDATE ${blockchain.toUpperCase()} VOTE ===`);
      console.log(`New candidate ID: ${candidateId}`);
      
      let response;
      if (blockchain === 'ethereum') {
        response = await api.updateEthereumVote(candidateId);
      } else {
        response = await api.updateHyperledgerVote(candidateId);
      }
      
      alert(`✅ ${response.data.message}`);
      
      await fetchCurrentVotes();
      await checkUserVoteStatus();
      setUpdatingVote(null);
      
    } catch (error) {
      console.error('Vote update failed:', error);
      const errorMsg = error.response?.data?.error || 'Vote update failed';
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if user hasn't been approved yet
  if (!userData.is_admin && !userData.approved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
            <div className="inline-flex justify-center items-center bg-white bg-opacity-20 p-4 rounded-full mb-4">
              <Clock size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h2>
            <p className="text-yellow-100">Your registration is being reviewed by an administrator.</p>
          </div>
          
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">
              Thank you for registering with VoteChain! Your account is currently pending approval. 
              You'll be able to access your dual-blockchain dashboard once an administrator approves your registration.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={onLogout}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-full flex items-center space-x-2 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FAIR VOTING SYSTEM - Voting Mode Selector Component  
// FAIR VOTING SYSTEM - Voting Mode Selector Component  
const VotingModeSelector = () => {
  // FAIR VOTING LOGIC - Check what user already voted on
  const hasEthereumVote = !!currentVotes.ethereum_vote;
  const hasHyperledgerVote = !!currentVotes.hyperledger_vote;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800 flex items-center">
          <Layers className="mr-2" size={20} />
          Blockchain Mode {(hasEthereumVote || hasHyperledgerVote) && <span className="ml-2 text-red-600">🔒 LOCKED</span>}
        </h4>
        <button
          onClick={() => setShowVotingModeSelector(!showVotingModeSelector)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Settings size={16} />
        </button>
      </div>
      
      {showVotingModeSelector && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {setVotingMode('ethereum'); setShowVotingModeSelector(false);}}
              disabled={!blockchainStatus.ethereum.connected}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                votingMode === 'ethereum'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              } ${!blockchainStatus.ethereum.connected ? 'opacity-50 cursor-not-allowed bg-red-100' : ''}`}
            >
              <Database className="inline mr-1" size={14} />
              Ethereum
            </button>
            
            <button
              onClick={() => {setVotingMode('hyperledger'); setShowVotingModeSelector(false);}}
              disabled={!blockchainStatus.hyperledger.connected}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                votingMode === 'hyperledger'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              } ${!blockchainStatus.hyperledger.connected ? 'opacity-50 cursor-not-allowed bg-red-100' : ''}`}
            >
              <Server className="inline mr-1" size={14} />
              Hyperledger
            </button>
            
            <button
              onClick={() => {setVotingMode('dual'); setShowVotingModeSelector(false);}}
              disabled={!blockchainStatus.ethereum.connected || !blockchainStatus.hyperledger.connected}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                votingMode === 'dual'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              } ${(!blockchainStatus.ethereum.connected || !blockchainStatus.hyperledger.connected) ? 'opacity-50 cursor-not-allowed bg-red-100' : ''}`}
            >
              <GitBranch className="inline mr-1" size={14} />
              Both
            </button>
          </div>
          
          {/* FAIR VOTING SYSTEM NOTICE */}
          <div className="text-xs text-gray-600 mt-2">
            {!hasEthereumVote && !hasHyperledgerVote && (
              <>
                {votingMode === 'ethereum' && '🔹 Vote on Ethereum blockchain only'}
                {votingMode === 'hyperledger' && '🔸 Vote on Hyperledger Fabric only'}
                {votingMode === 'dual' && '🔥 Vote on BOTH blockchains simultaneously'}
              </>
            )}
            
            {(hasEthereumVote || hasHyperledgerVote) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-medium">🔒 FAIR VOTING SYSTEM ACTIVE</div>
                <div className="text-red-600 mt-1">
                  You voted on <strong>{hasEthereumVote ? 'Ethereum' : 'Hyperledger'}</strong>. 
                  Other blockchains are now LOCKED to ensure fair voting.
                </div>
                <div className="text-red-500 text-xs mt-1">
                  ✅ You can only UPDATE your existing vote, no new blockchain voting allowed.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!showVotingModeSelector && (
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            votingMode === 'ethereum' ? 'bg-blue-100 text-blue-800' :
            votingMode === 'hyperledger' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {votingMode === 'ethereum' && <><Database className="mr-1" size={12} /> Ethereum</>}
            {votingMode === 'hyperledger' && <><Server className="mr-1" size={12} /> Hyperledger</>}
            {votingMode === 'dual' && <><GitBranch className="mr-1" size={12} /> Dual Mode</>}
          </span>
          <span className="text-xs text-gray-500">
            {(currentVotes.ethereum_vote || currentVotes.hyperledger_vote) ? 
              '🔒 LOCKED - Fair Voting Active' : 
              'Click settings to change'
            }
          </span>
        </div>
      )}
    </div>
  );
};

  // Blockchain Status Component
  const BlockchainStatus = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
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
        {currentVotes.ethereum_vote && (
          <div className="mt-2 text-xs">
            <span className="font-medium text-green-600">
              ✅ Voted for {currentVotes.ethereum_vote.candidate_name}
            </span>
          </div>
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
        {currentVotes.hyperledger_vote && (
          <div className="mt-2 text-xs">
            <span className="font-medium text-green-600">
              ✅ Voted for {currentVotes.hyperledger_vote.candidate_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-6xl mx-auto">
        {/* Header with Election Info */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 relative">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                Hi, {userData?.username || userData?.email?.split('@')[0]}!
                <div className="ml-3 flex space-x-2">
                  {userData.is_candidate && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Award size={16} className="mr-1" />
                      Candidate
                    </span>
                  )}
                  {userData.is_elector && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Users size={16} className="mr-1" />
                      Elector
                    </span>
                  )}
                </div>
              </h2>
              
              {userData.selected_election_details ? (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-3">
                  <p className="text-purple-100 text-sm">Participating in:</p>
                  <p className="text-white font-medium">
                    {userData.selected_election_details.title}
                  </p>
                  <p className="text-purple-100 text-sm">
                    {userData.selected_election_details.election_type_display} Election
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Layers size={14} className="text-purple-100" />
                    <span className="text-purple-100 text-xs">Vote Once, Edit Only - No Re-voting</span>
                  </div>
                </div>
              ) : (
                <p className="text-purple-100">
                  Welcome to your dual blockchain voting dashboard
                </p>
              )}
            </div>
            
            <button 
              onClick={onLogout}
              className="bg-white text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-full flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Blockchain Status */}
        <div className="p-6 bg-gray-50 border-b">
          <BlockchainStatus />
        </div>

        {/* Current Votes Display */}
        {(currentVotes.ethereum_vote || currentVotes.hyperledger_vote) && (
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-600" size={20} />
              Your Current Votes (Edit Only - No Re-voting)
              <button
                onClick={fetchCurrentVotes}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <RefreshCw size={16} />
              </button>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Ethereum Vote */}
              <div className={`p-4 rounded-xl border ${
                currentVotes.ethereum_vote ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="text-blue-600" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-800">Ethereum Vote</h4>
                      {currentVotes.ethereum_vote ? (
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            ✅ {currentVotes.ethereum_vote.candidate_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Voted: {new Date(currentVotes.ethereum_vote.voted_at).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No vote yet</p>
                      )}
                    </div>
                  </div>
                  {currentVotes.ethereum_vote && (
                    <button
                      onClick={() => setUpdatingVote({
                        blockchain: 'ethereum', 
                        current: currentVotes.ethereum_vote
                      })}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-all"
                      disabled={loading}
                      title="Update Ethereum vote"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Hyperledger Vote */}
              <div className={`p-4 rounded-xl border ${
                currentVotes.hyperledger_vote ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="text-green-600" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-800">Hyperledger Vote</h4>
                      {currentVotes.hyperledger_vote ? (
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            ✅ {currentVotes.hyperledger_vote.candidate_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Voted: {new Date(currentVotes.hyperledger_vote.voted_at).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No vote yet</p>
                      )}
                    </div>
                  </div>
                  {currentVotes.hyperledger_vote && (
                    <button
                      onClick={() => setUpdatingVote({
                        blockchain: 'hyperledger', 
                        current: currentVotes.hyperledger_vote
                      })}
                      className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-100 transition-all"
                      disabled={loading}
                      title="Update Hyperledger vote"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Important Notice */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ <strong>Note:</strong> Once you vote, you can only UPDATE your choice. No additional voting is allowed.
              </p>
            </div>
          </div>
        )}

        {/* Wallet Connection */}
        <div className="p-6 bg-gray-50 border-b">
          <div className={`p-4 rounded-xl ${
            userData.wallet_address ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wallet className={userData.wallet_address ? 'text-green-600' : 'text-yellow-600'} size={24} />
                <div>
                  <h3 className={`font-medium ${userData.wallet_address ? 'text-green-800' : 'text-yellow-800'}`}>
                    {userData.wallet_address ? 'Ganache Wallet Connected' : 'Connect Ganache Wallet'}
                  </h3>
                  <p className={`text-sm ${userData.wallet_address ? 'text-green-600' : 'text-yellow-600'}`}>
                    {userData.wallet_address 
                      ? `Connected: ${userData.wallet_address?.slice(0, 8)}...${userData.wallet_address?.slice(-6)}`
                      : `Get a Ganache account to participate in voting (${walletStats.available} available)`
                    }
                  </p>
                </div>
              </div>
              
              {!userData.wallet_address && (
                <div className="flex items-center space-x-3">
                  {availableAccounts.length > 0 ? (
                    <>
                      <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Available Account ({availableAccounts.length})</option>
                        {availableAccounts.map((account, index) => (
                          <option key={account} value={account}>
                            Account {index + 1}: {account.slice(0, 10)}...
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={connectGanacheWallet}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                      >
                        <Wallet size={18} />
                        <span>Connect</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={assignGanacheAddress}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                    >
                      <Wallet size={18} />
                      <span>Get Ganache Address</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Voting Mode Selector - Only show if user hasn't voted yet */}
            {userData.wallet_address && !currentVotes.ethereum_vote && !currentVotes.hyperledger_vote && (
              <div className="mt-4">
                <VotingModeSelector />
              </div>
            )}
            
            {/* Show locked message if user has voted */}
            {userData.wallet_address && (currentVotes.ethereum_vote || currentVotes.hyperledger_vote) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  🔒 <strong>Voting Mode Locked:</strong> You have already voted on {currentVotes.ethereum_vote ? 'Ethereum' : 'Hyperledger'}. You can only update your existing vote.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Candidates Section */}
        <div className="p-8">
          {userData?.approved && userData.selected_election_details && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Award className="mr-2" size={24} />
                Candidates for {userData.selected_election_details.title}
                <span className="ml-2 text-sm text-gray-500">
                  ({userData.selected_election_details.election_type_display})
                </span>
                <div className="ml-auto flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    votingMode === 'ethereum' ? 'bg-blue-100 text-blue-800' :
                    votingMode === 'hyperledger' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {votingMode === 'ethereum' && <><Database className="mr-1" size={12} /> Ethereum Mode</>}
                    {votingMode === 'hyperledger' && <><Server className="mr-1" size={12} /> Hyperledger Mode</>}
                    {votingMode === 'dual' && <><GitBranch className="mr-1" size={12} /> Dual Mode</>}
                  </span>
                  <button
                    onClick={() => {
                      checkUserVoteStatus();
                      fetchCurrentVotes();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </h3>
              
              {candidates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No candidates available for this election</p>
                  <p className="text-gray-500 text-sm mt-2">Check back later for candidate listings</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {candidates.map((candidate) => {
                    const hasEthVote = currentVotes.ethereum_vote?.candidate_id === candidate.blockchain_id;
                    const hasHlfVote = currentVotes.hyperledger_vote?.candidate_id === candidate.blockchain_id;
                    const hasAnyVote = hasEthVote || hasHlfVote;
                    
                    // NEW LOGIC: Check if user has voted ANYWHERE
                    const userHasVotedEthereum = !!currentVotes.ethereum_vote;
                    const userHasVotedHyperledger = !!currentVotes.hyperledger_vote;
                    const userHasVotedAnywhere = userHasVotedEthereum || userHasVotedHyperledger;
                    
                    const canVote = userData.wallet_address && userData.approved && userData.is_elector;
                    
                    return (
                      <div key={candidate.database_id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <User size={32} className="text-purple-600" />
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 text-lg mb-2">
                            {candidate.username || candidate.email}
                          </h4>
                          
                          {candidate.election_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                              {candidate.election_type}
                            </span>
                          )}
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Email:</span> {candidate.email}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Wallet:</span> {candidate.wallet_address?.slice(0, 8)}...{candidate.wallet_address?.slice(-6)}
                            </p>
                            
                            {/* Debug info */}
                            <div className="bg-gray-100 p-2 rounded text-xs text-gray-500">
                              <p><strong>DB ID:</strong> {candidate.database_id}</p>
                              <p><strong>Blockchain ID:</strong> {candidate.blockchain_id}</p>
                            </div>
                          </div>
                          
                          {/* Vote Status Indicators */}
                          <div className="flex justify-center space-x-2 mb-4">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              hasEthVote ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {hasEthVote ? '✓ ETH' : '○ ETH'}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              hasHlfVote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {hasHlfVote ? '✓ HLF' : '○ HLF'}
                            </div>
                          </div>
                          
                          {/* UPDATED VOTING/UPDATE LOGIC - VOTE ONCE, EDIT ONLY */}
                          <div className="space-y-2">
                            {/* IF USER HAS NOT VOTED ANYWHERE - ALLOW FIRST VOTE */}
                            {!userHasVotedAnywhere && (
                              <div>
                                {/* Single Mode Voting (Ethereum/Hyperledger) */}
                                {votingMode !== 'dual' && (
                                  <button
                                    onClick={() => {
                                      if (!userData.wallet_address) {
                                        assignGanacheAddress();
                                        return;
                                      }
                                      setVotingFor(candidate.blockchain_id);
                                    }}
                                    disabled={!canVote || loading}
                                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                                      !canVote
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : votingMode === 'ethereum'
                                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                    } ${loading ? 'opacity-50' : ''}`}
                                  >
                                    {loading ? (
                                      <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Vote size={18} />
                                        <span>Vote on {votingMode === 'ethereum' ? 'Ethereum' : 'Hyperledger'}</span>
                                      </>
                                    )}
                                  </button>
                                )}
                                
                                {/* Dual Mode Voting */}
                                {votingMode === 'dual' && (
                                  <button
                                    onClick={() => {
                                      if (!userData.wallet_address) {
                                        assignGanacheAddress();
                                        return;
                                      }
                                      setVotingFor(candidate.blockchain_id);
                                    }}
                                    disabled={!canVote || loading}
                                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                                      !canVote
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                                    } ${loading ? 'opacity-50' : ''}`}
                                  >
                                    {loading ? (
                                      <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Vote size={18} />
                                        <span>Vote on Both Blockchains</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {/* IF USER HAS VOTED - ONLY ALLOW UPDATES */}
                            {userHasVotedAnywhere && (
                              <div className="space-y-2">
                                {/* Ethereum Update Button */}
                                {userHasVotedEthereum && (
                                  <button
                                    onClick={() => setUpdatingVote({
                                      blockchain: 'ethereum',
                                      candidateId: candidate.blockchain_id,
                                      currentCandidate: currentVotes.ethereum_vote.candidate_name
                                    })}
                                    disabled={!canVote || loading}
                                    className="w-full px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                                  >
                                    <Edit size={16} />
                                    <span>Update Ethereum Vote</span>
                                  </button>
                                )}
                                
                                {/* Hyperledger Update Button */}
                                {userHasVotedHyperledger && (
                                  <button
                                    onClick={() => setUpdatingVote({
                                      blockchain: 'hyperledger',
                                      candidateId: candidate.blockchain_id,
                                      currentCandidate: currentVotes.hyperledger_vote.candidate_name
                                    })}
                                    disabled={!canVote || loading}
                                    className="w-full px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all text-sm bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                                  >
                                    <Edit size={16} />
                                    <span>Update Hyperledger Vote</span>
                                  </button>
                                )}
                                
                                {/* No New Voting Message */}
                                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-xs text-red-700 text-center">
                                    🔒 You have already voted. Only updates allowed.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Current vote display for this candidate */}
                          {hasAnyVote && (
                            <div className="mt-3 p-2 rounded bg-green-50 border border-green-200">
                              <p className="text-xs text-green-700 font-medium">
                                ✅ You voted for this candidate
                                {hasEthVote && hasHlfVote ? ' on both blockchains' :
                                 hasEthVote ? ' on Ethereum' : ' on Hyperledger'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Current Election Status */}
          {userData.selected_election_details && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Calendar className="mr-2" size={24} />
                Your Election Status
              </h3>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{userData.selected_election_details.title}</h4>
                    <p className="text-blue-100 mb-2">
                      {userData.selected_election_details.election_type_display} Election
                    </p>
                    <div className="text-sm text-blue-100 space-y-1">
                      <p>Start: {new Date(userData.selected_election_details.start_date).toLocaleDateString()}</p>
                      <p>End: {new Date(userData.selected_election_details.end_date).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Voting summary */}
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Database size={14} />
                        <span>Ethereum: {currentVotes.ethereum_vote ? 'Voted' : 'Not voted'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Server size={14} />
                        <span>Hyperledger: {currentVotes.hyperledger_vote ? 'Voted' : 'Not voted'}</span>
                      </div>
                    </div>
                    
                    {/* Voting status */}
                    {(currentVotes.ethereum_vote || currentVotes.hyperledger_vote) && (
                      <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                        <p className="text-xs text-white">
                          🔒 <strong>Voting Locked:</strong> You can only update your existing votes.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-full">
                    <Calendar size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vote Confirmation Modal - ONLY FOR FIRST-TIME VOTING */}
      {votingFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${
                votingMode === 'ethereum' ? 'bg-blue-100' :
                votingMode === 'hyperledger' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                <Vote size={32} className={
                  votingMode === 'ethereum' ? 'text-blue-600' :
                  votingMode === 'hyperledger' ? 'text-green-600' :
                  'text-purple-600'
                } />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Your First Vote</h3>
              
              {(() => {
                const candidate = candidates.find(c => c.blockchain_id === votingFor);
                return candidate ? (
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to vote for{' '}
                      <span className="font-medium">
                        {candidate.username || candidate.email}
                      </span>
                      {' '}using{' '}
                      <span className={`font-medium ${
                        votingMode === 'ethereum' ? 'text-blue-600' :
                        votingMode === 'hyperledger' ? 'text-green-600' :
                        'text-purple-600'
                      }`}>
                        {votingMode === 'ethereum' ? 'Ethereum blockchain' :
                         votingMode === 'hyperledger' ? 'Hyperledger Fabric' :
                         'both Ethereum and Hyperledger blockchains'}
                      </span>?
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-yellow-700">
                        ⚠️ <strong>Important:</strong> After voting, you can only UPDATE your choice. No additional voting is allowed.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                      <p><strong>Election:</strong> {userData.selected_election_details?.title}</p>
                      <p><strong>Candidate:</strong> {candidate.username || candidate.email}</p>
                      <p><strong>Blockchain ID:</strong> {candidate.blockchain_id}</p>
                      <p><strong>Voting Mode:</strong> {
                        votingMode === 'ethereum' ? 'Ethereum Only' :
                        votingMode === 'hyperledger' ? 'Hyperledger Only' :
                        'Dual Blockchain (Both)'
                      }</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to cast your vote?
                  </p>
                );
              })()}
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setVotingFor(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVote(votingFor)}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all text-white ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    votingMode === 'ethereum' 
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : votingMode === 'hyperledger'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Confirm First Vote`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Vote Modal */}
      {updatingVote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Update {updatingVote.blockchain === 'ethereum' ? 'Ethereum' : 'Hyperledger'} Vote
                </h3>
                <button
                  onClick={() => setUpdatingVote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              {updatingVote.currentCandidate && (
                <p className="text-gray-600 mb-4">
                  Current vote: <span className="font-medium">{updatingVote.currentCandidate}</span>
                </p>
              )}
              
              <p className="text-gray-600 mb-6">
                Select new candidate for your {updatingVote.blockchain} vote:
              </p>
              
              <div className="space-y-2 mb-6">
                {candidates.map((candidate) => (
                  <button
                    key={candidate.blockchain_id}
                    onClick={() => handleUpdateVote(updatingVote.blockchain, candidate.blockchain_id)}
                    disabled={loading}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' :
                      updatingVote.blockchain === 'ethereum' ? 'hover:bg-blue-50 hover:border-blue-200' :
                      'hover:bg-green-50 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{candidate.username || candidate.email}</div>
                        <div className="text-sm text-gray-500">ID: {candidate.blockchain_id}</div>
                      </div>
                      {/* Show if user already voted for this candidate */}
                      {((updatingVote.blockchain === 'ethereum' && currentVotes.ethereum_vote?.candidate_id === candidate.blockchain_id) ||
                        (updatingVote.blockchain === 'hyperledger' && currentVotes.hyperledger_vote?.candidate_id === candidate.blockchain_id)) && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setUpdatingVote(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                disabled={loading}
              >
                Cancel
              </button>
              
              {loading && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    ⏳ Updating vote on {updatingVote.blockchain}... Please wait.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteDashboard;