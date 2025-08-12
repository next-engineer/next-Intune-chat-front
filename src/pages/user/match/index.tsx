import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../modules/user/apis';
import Layout from '../../../commons/components/layouts';

const MatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatch = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await userApi.match();
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to find match');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (roomId: string) => {
    navigate(`/chat/room/${roomId}`);
  };

  return (
    <Layout title="Find Match">
      <div className="match-page">
        <h2>Find Your Match</h2>
        <p>Click the button below to find someone to chat with!</p>
        
        <button 
          onClick={handleMatch} 
          disabled={loading}
          className="match-button"
        >
          {loading ? 'Finding match...' : 'Find Match'}
        </button>

        {error && <div className="error">{error}</div>}

        {matchResult && (
          <div className="match-result">
            <h3>Match Found!</h3>
            <div className="match-info">
              <p><strong>Name:</strong> {matchResult.name}</p>
              <p><strong>Interests:</strong> {matchResult.interests?.join(', ') || 'No interests listed'}</p>
            </div>
            <button 
              onClick={() => handleStartChat(matchResult.roomId)}
              className="start-chat-button"
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchPage; 