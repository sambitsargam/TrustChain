import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSuiClient } from '@onelabs/dapp-kit';
import '../styles/Leaderboard.css';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

interface Profile {
  id: string;
  owner: string;
  username: string;
  trust_score: number;
  total_interactions: number;
  positive_interactions: number;
  badges: string[];
  created_at: number;
}

function Leaderboard() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else {
      fetchLeaderboard();
    }
  }, [account, navigate]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::trust_system::ProfileCreated`
        },
        limit: 100,
      });

      const profilePromises = response.data.map(async (event: any) => {
        const profileOwner = event.parsedJson.owner;
        try {
          const objects = await suiClient.getOwnedObjects({
            owner: profileOwner,
            filter: {
              StructType: `${PACKAGE_ID}::trust_system::TrustProfile`
            },
            options: {
              showContent: true,
            }
          });

          if (objects.data.length > 0) {
            const profileData = objects.data[0].data?.content as any;
            if (profileData?.fields) {
              return {
                id: profileData.fields.id.id,
                owner: profileData.fields.owner,
                username: profileData.fields.username,
                trust_score: parseInt(profileData.fields.trust_score),
                total_interactions: parseInt(profileData.fields.total_interactions),
                positive_interactions: parseInt(profileData.fields.positive_interactions),
                badges: profileData.fields.badges || [],
                created_at: parseInt(profileData.fields.created_at),
              };
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
        return null;
      });

      const fetchedProfiles = (await Promise.all(profilePromises)).filter(p => p !== null) as Profile[];
      const sorted = fetchedProfiles.sort((a, b) => b.trust_score - a.trust_score);
      setProfiles(sorted);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <button className="back-btn" onClick={() => navigate('/app')}>
          ← Back
        </button>
        <div className="header-content">
          <h1>🏆 Leaderboard</h1>
          <p>Top trusted members of the TrustChain community</p>
        </div>
      </div>

      <div className="timeframe-selector">
        <button 
          className={timeframe === 'all' ? 'active' : ''}
          onClick={() => setTimeframe('all')}
        >
          All Time
        </button>
        <button 
          className={timeframe === 'month' ? 'active' : ''}
          onClick={() => setTimeframe('month')}
        >
          This Month
        </button>
        <button 
          className={timeframe === 'week' ? 'active' : ''}
          onClick={() => setTimeframe('week')}
        >
          This Week
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : (
        <>
          {profiles.length >= 3 && (
            <div className="podium">
              {/* 2nd Place */}
              <div className="podium-item second">
                <div className="rank-badge">🥈</div>
                <div className="profile-avatar">
                  {profiles[1].username.charAt(0).toUpperCase()}
                </div>
                <h3>{profiles[1].username}</h3>
                <div className="score" style={{ color: getTrustScoreColor(profiles[1].trust_score) }}>
                  {profiles[1].trust_score}
                </div>
                <button onClick={() => navigate(`/profile/${profiles[1].owner}`)}>
                  View Profile
                </button>
              </div>

              {/* 1st Place */}
              <div className="podium-item first">
                <div className="rank-badge">🥇</div>
                <div className="crown">👑</div>
                <div className="profile-avatar">
                  {profiles[0].username.charAt(0).toUpperCase()}
                </div>
                <h3>{profiles[0].username}</h3>
                <div className="score" style={{ color: getTrustScoreColor(profiles[0].trust_score) }}>
                  {profiles[0].trust_score}
                </div>
                <button onClick={() => navigate(`/profile/${profiles[0].owner}`)}>
                  View Profile
                </button>
              </div>

              {/* 3rd Place */}
              <div className="podium-item third">
                <div className="rank-badge">🥉</div>
                <div className="profile-avatar">
                  {profiles[2].username.charAt(0).toUpperCase()}
                </div>
                <h3>{profiles[2].username}</h3>
                <div className="score" style={{ color: getTrustScoreColor(profiles[2].trust_score) }}>
                  {profiles[2].trust_score}
                </div>
                <button onClick={() => navigate(`/profile/${profiles[2].owner}`)}>
                  View Profile
                </button>
              </div>
            </div>
          )}

          <div className="leaderboard-list">
            <div className="list-header">
              <div className="col-rank">Rank</div>
              <div className="col-user">User</div>
              <div className="col-score">Trust Score</div>
              <div className="col-interactions">Interactions</div>
              <div className="col-badges">Badges</div>
              <div className="col-action"></div>
            </div>

            {profiles.map((profile, index) => (
              <div 
                key={profile.id} 
                className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
              >
                <div className="col-rank">
                  <span className="rank-number">{getRankIcon(index + 1)}</span>
                </div>
                <div className="col-user">
                  <div className="user-info">
                    <div className="avatar">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="username">{profile.username}</div>
                      <div className="address">
                        {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-score">
                  <div 
                    className="score-badge"
                    style={{ 
                      background: `${getTrustScoreColor(profile.trust_score)}20`,
                      color: getTrustScoreColor(profile.trust_score)
                    }}
                  >
                    {profile.trust_score}
                  </div>
                </div>
                <div className="col-interactions">
                  <span className="stat-value">{profile.total_interactions}</span>
                  <span className="stat-label">total</span>
                </div>
                <div className="col-badges">
                  <span className="badge-count">{profile.badges.length}</span>
                </div>
                <div className="col-action">
                  <button 
                    className="view-btn"
                    onClick={() => navigate(`/profile/${profile.owner}`)}
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
