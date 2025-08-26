import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [electionRes, candidatesRes] = await Promise.all([
          api.getElection(id),
          api.getCandidates(id)
        ]);
        setElection(electionRes.data);
        setCandidates(candidatesRes.data);
        
        // Check if user has already voted
        if (electionRes.data.user_has_voted) {
          setHasVoted(true);
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleVote = async (candidateId) => {
    try {
      await api.castVote(id, candidateId);
      setHasVoted(true);
      alert('Vote submitted successfully!');
    } catch (err) {
      alert('Voting failed: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 mb-2">{election.title}</h2>
      <p className="text-gray-600 mb-4">{election.description}</p>
      
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <p>
          <span className="font-medium">Status:</span> 
          {election.is_active ? ' Active' : ' Ended'}
        </p>
        <p>
          <span className="font-medium">Period:</span> 
          {new Date(election.start_time).toLocaleString()} - 
          {new Date(election.end_time).toLocaleString()}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-4">Candidates</h3>
      
      {hasVoted ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
          You have already voted in this election.
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => (
            <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{candidate.user.username}</h4>
                  <p className="text-sm text-gray-600">{candidate.bio}</p>
                </div>
                <button
                  onClick={() => handleVote(candidate.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full text-sm"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-full"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ElectionDetail;