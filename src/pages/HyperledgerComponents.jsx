import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Clock,
  Network,
  Vote,
  BarChart3,
  Shield,
  Zap,
  RefreshCw,
  TrendingUp,
  FileText,
  Server,
  Settings
} from 'lucide-react';

// Notification Component
export const NotificationItem = ({ notification, getNotificationIcon }) => (
  <div
    key={notification.id}
    className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 max-w-sm animate-slide-in"
  >
    <div className="flex items-center space-x-2">
      {getNotificationIcon(notification.type)}
      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
    </div>
  </div>
);

// Tab Navigation Component
export const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Network Overview', icon: Server },
    { id: 'voting', label: 'Voting Interface', icon: Vote },
    { id: 'results', label: 'Results & Analytics', icon: BarChart3 },
    { id: 'transactions', label: 'Transaction History', icon: FileText },
    { id: 'admin', label: 'Admin Tools', icon: Settings }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 mb-6">
      <div className="flex space-x-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium rounded-t-2xl transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Network Statistics Component
export const NetworkStatistics = ({ networkStats }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Network className="w-5 h-5 text-blue-600 mr-2" />
      Network Statistics
    </h3>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-xl">
        <div className="text-2xl font-bold text-blue-600">{networkStats.peers}</div>
        <div className="text-sm text-gray-600">Active Peers</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-xl">
        <div className="text-2xl font-bold text-green-600">{networkStats.channels}</div>
        <div className="text-sm text-gray-600">Channels</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-xl">
        <div className="text-2xl font-bold text-purple-600">{networkStats.chaincodes}</div>
        <div className="text-sm text-gray-600">Chaincodes</div>
      </div>
      <div className="text-center p-4 bg-yellow-50 rounded-xl">
        <div className="text-2xl font-bold text-yellow-600">{networkStats.transactions}</div>
        <div className="text-sm text-gray-600">Transactions</div>
      </div>
    </div>
  </div>
);

// Election Status Component
export const ElectionStatus = ({ userData, voteStatus }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Vote className="w-5 h-5 text-blue-600 mr-2" />
      Election Status
    </h3>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium text-gray-900">Current Election</div>
          <div className="text-sm text-gray-600">
            {userData?.selected_election_details?.title || 'No election selected'}
          </div>
        </div>
        <div className="text-green-600">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium text-gray-900">Your Vote Status</div>
          <div className="text-sm text-gray-600">
            {voteStatus.has_voted ? 'Vote submitted' : 'Not voted yet'}
          </div>
        </div>
        <div className={voteStatus.has_voted ? 'text-green-600' : 'text-yellow-600'}>
          {voteStatus.has_voted ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
        </div>
      </div>
    </div>
  </div>
);

// Quick Actions Component
export const QuickActions = ({ setActiveTab, fetchNetworkHealth, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Zap className="w-5 h-5 text-blue-600 mr-2" />
      Quick Actions
    </h3>
    
    <div className="space-y-3">
      <button
        onClick={() => setActiveTab('voting')}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Go to Voting
      </button>
      
      <button
        onClick={() => setActiveTab('results')}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      >
        View Results
      </button>
      
      <button
        onClick={fetchNetworkHealth}
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Refresh Network'}
      </button>
    </div>
  </div>
);

// Network Health Component
export const NetworkHealth = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Shield className="w-5 h-5 text-blue-600 mr-2" />
      Network Health
    </h3>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Consensus</span>
        <span className="text-green-600 font-medium">Healthy</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Peer Connection</span>
        <span className="text-green-600 font-medium">Connected</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Chaincode</span>
        <span className="text-green-600 font-medium">Active</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Last Block</span>
        <span className="text-gray-600 font-medium text-xs">2 min ago</span>
      </div>
    </div>
  </div>
);

// Hyperledger Voting Panel
export const HyperledgerVotingPanel = ({ voteStatus, candidates, selectedCandidate, setSelectedCandidate, handleVote, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Network className="w-5 h-5 text-blue-600 mr-2" />
      Hyperledger Fabric Voting
    </h3>
    
    {voteStatus.has_voted ? (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Vote Submitted</h4>
        <p className="text-gray-600">Your vote has been recorded on Hyperledger Fabric</p>
      </div>
    ) : (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Cast your vote using Hyperledger Fabric blockchain technology
        </p>
        
        <div className="space-y-3">
          {candidates.map((candidate, index) => (
            <label
              key={candidate.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="hyperledger-candidate"
                value={index + 1}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{candidate.username}</div>
                <div className="text-xs text-gray-500">{candidate.email}</div>
              </div>
            </label>
          ))}
        </div>
        
        <button
          onClick={() => handleVote(selectedCandidate)}
          disabled={!selectedCandidate || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Vote on Hyperledger'}
        </button>
      </div>
    )}
  </div>
);

// Dual Blockchain Voting Panel
export const DualBlockchainVotingPanel = ({ candidates, selectedCandidate, setSelectedCandidate, handleDualVote, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
      Dual Blockchain Voting
    </h3>
    
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">
        Cast your vote on both Ethereum and Hyperledger simultaneously for maximum security
      </p>
      
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">Dual Blockchain Benefits:</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Enhanced security through redundancy</li>
          <li>• Cross-blockchain verification</li>
          <li>• Immutable audit trail</li>
          <li>• Enterprise-grade reliability</li>
        </ul>
      </div>
      
      <div className="space-y-3">
        {candidates.map((candidate, index) => (
          <label
            key={`dual-${candidate.id}`}
            className="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name="dual-candidate"
              value={index + 1}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{candidate.username}</div>
              <div className="text-xs text-gray-500">{candidate.email}</div>
            </div>
          </label>
        ))}
      </div>
      
      <button
        onClick={() => handleDualVote(selectedCandidate)}
        disabled={!selectedCandidate || loading}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting to Both Chains...' : 'Vote on Both Blockchains'}
      </button>
    </div>
  </div>
);

// Election Results Component
export const ElectionResults = ({ electionResults, fetchElectionResults }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
      Election Results & Analytics
    </h3>
    
    {electionResults ? (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{electionResults.totalVotes || 0}</div>
            <div className="text-sm text-gray-600">Total Votes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{electionResults.candidates?.length || 0}</div>
            <div className="text-sm text-gray-600">Candidates</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Transparency</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {electionResults.candidates?.map((candidate, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-gray-900">{candidate.name}</div>
                <div className="text-sm text-gray-600">{candidate.votes} votes</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${candidate.percentage || 0}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{candidate.percentage?.toFixed(1) || 0}%</div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h4>
        <p className="text-gray-600">Results will appear here after voting begins</p>
        <button
          onClick={fetchElectionResults}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Results
        </button>
      </div>
    )}
  </div>
);

// Transaction History Component
export const TransactionHistory = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      <FileText className="w-5 h-5 text-blue-600 mr-2" />
      Transaction History
    </h3>
    
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-gray-900">Vote Transaction</div>
          <div className="text-sm text-gray-600">2 minutes ago</div>
        </div>
        <div className="text-sm text-gray-600 mb-2">Transaction ID: hlf-tx-001</div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Confirmed</span>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-gray-900">Candidate Addition</div>
          <div className="text-sm text-gray-600">1 hour ago</div>
        </div>
        <div className="text-sm text-gray-600 mb-2">Transaction ID: hlf-tx-002</div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Confirmed</span>
        </div>
      </div>
    </div>
  </div>
);

// Admin Tools Component
export const AdminTools = ({ userData, createHyperledgerElection, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
      <Server className="w-5 h-5 text-blue-600 mr-2" />
      Admin Tools
    </h3>
    
    {userData?.is_admin ? (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={createHyperledgerElection}
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            Create HLF Election
          </button>
          
          <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Deploy Chaincode
          </button>
          
          <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Network Monitor
          </button>
          
          <button className="bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
            Audit Trail
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Network Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Peers Connected:</span>
              <span className="text-green-600 font-medium">1/1</span>
            </div>
            <div className="flex justify-between">
              <span>Chaincode Status:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Last Block:</span>
              <span className="text-gray-600">Block #245</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h4>
        <p className="text-gray-600">These tools are only available to administrators</p>
      </div>
    )}
  </div>
);