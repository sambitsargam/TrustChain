import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSuiClient } from '@onelabs/dapp-kit';
import '../styles/Explore.css';

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

function Explore() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'top' | 'new'>('all');

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else {
      fetchAllProfiles();
    }
  }, [account, navigate]);

  const fetchAllProfiles = async () => {
    setLoading(true);
    try {
      // Fetch all TrustProfile objects
      const response = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::trust_system::ProfileCreated`
        },
        limit: 50,
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
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles
    .filter(profile => 
      profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.owner.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (filterBy === 'top') return b.trust_score - a.trust_score;
      if (filterBy === 'new') return b.created_at - a.created_at;
      return 0;
    });

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Building';
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/app')}>
            ← Back to Dashboard
          </button>
          <h1>Explore Profiles</h1>
          <p>Discover and connect with trusted members of the community</p>
        </div>
      </div>

      <div className="explore-controls">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by username or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={filterBy === 'all' ? 'active' : ''}
            onClick={() => setFilterBy('all')}
          >
            All
          </button>
          <button 
            className={filterBy === 'top' ? 'active' : ''}
            onClick={() => setFilterBy('top')}
          >
            Top Rated
          </button>
          <button 
            className={filterBy === 'new' ? 'active' : ''}
            onClick={() => setFilterBy('new')}
          >
            Newest
          </button>
        </div>
      </div>

      <div className="explore-stats">
        <div className="stat-box">
          <div className="stat-value">{profiles.length}</div>
          <div className="stat-label">Total Profiles</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {profiles.filter(p => p.trust_score >= 80).length}
          </div>
          <div className="stat-label">Excellent Ratings</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {profiles.reduce((sum, p) => sum + p.badges.length, 0)}
          </div>
          <div className="stat-label">Total Badges</div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profiles...</p>
        </div>
      ) : (
        <div className="profiles-grid">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <div 
                key={profile.id} 
                className="profile-card"
                onClick={() => navigate(`/profile/${profile.owner}`)}
              >
                <div className="profile-card-header">
                  <div className="profile-avatar">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{profile.username}</h3>
                    <p className="address">
                      {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
                    </p>
                  </div>
                </div>

                <div className="trust-score-badge" style={{ borderColor: getTrustScoreColor(profile.trust_score) }}>
                  <div className="score">{profile.trust_score}</div>
                  <div className="label">{getTrustScoreLabel(profile.trust_score)}</div>
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <span className="icon">💬</span>
                    <span className="value">{profile.total_interactions}</span>
                  </div>
                  <div className="stat">
                    <span className="icon">✅</span>
                    <span className="value">{profile.positive_interactions}</span>
                  </div>
                  <div className="stat">
                    <span className="icon">🏆</span>
                    <span className="value">{profile.badges.length}</span>
                  </div>
                </div>

                <button className="view-profile-btn">
                  View Profile →
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No profiles found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;
