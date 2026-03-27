import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import '../styles/ProfileView.css';

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

function ProfileView() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [endorsing, setEndorsing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else if (address) {
      fetchProfile();
    }
  }, [account, address, navigate]);

  const fetchProfile = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: address,
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
          setProfile({
            id: profileData.fields.id.id,
            owner: profileData.fields.owner,
            username: profileData.fields.username,
            trust_score: parseInt(profileData.fields.trust_score),
            total_interactions: parseInt(profileData.fields.total_interactions),
            positive_interactions: parseInt(profileData.fields.positive_interactions),
            badges: profileData.fields.badges || [],
            created_at: parseInt(profileData.fields.created_at),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const endorseUser = async () => {
    if (!profile) return;

    setEndorsing(true);
    setMessage('');

    try {
      const newScore = Math.min(100, profile.trust_score + 5);
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::trust_system::update_trust_score`,
        arguments: [
          tx.object(profile.id),
          tx.pure.u64(newScore),
          tx.pure.bool(true),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setMessage('✅ Endorsement successful! +5 trust score');
            setTimeout(() => fetchProfile(), 2000);
          },
          onError: (error) => {
            console.error('Error:', error);
            setMessage('❌ Error endorsing user');
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('❌ Transaction failed');
    } finally {
      setEndorsing(false);
    }
  };

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

  if (loading) {
    return (
      <div className="profile-view-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-view-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Profile Not Found</h2>
          <p>This user hasn't created a TrustChain profile yet</p>
          <button onClick={() => navigate('/explore')}>← Back to Explore</button>
        </div>
      </div>
    );
  }

  const isOwnProfile = account?.address === profile.owner;

  return (
    <div className="profile-view-page">
      <div className="profile-header-section">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <div className="profile-banner">
          <div className="banner-gradient"></div>
          <div className="profile-main-info">
            <div className="profile-avatar-large">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <h1>{profile.username}</h1>
              <p className="profile-address">
                {profile.owner.slice(0, 10)}...{profile.owner.slice(-8)}
              </p>
              {isOwnProfile && (
                <span className="own-profile-badge">Your Profile</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="main-column">
          <div className="trust-score-section">
            <h2>Trust Score</h2>
            <div className="score-display-large">
              <div 
                className="score-circle-xl"
                style={{ borderColor: getTrustScoreColor(profile.trust_score) }}
              >
                <div className="score-number">{profile.trust_score}</div>
                <div className="score-max">/100</div>
              </div>
              <div className="score-info">
                <div className="score-label-xl">{getTrustScoreLabel(profile.trust_score)}</div>
                <p className="score-description">
                  This user has {profile.total_interactions} total interactions with{' '}
                  {profile.total_interactions > 0 
                    ? Math.round((profile.positive_interactions / profile.total_interactions) * 100)
                    : 0}% success rate
                </p>
                {!isOwnProfile && (
                  <button 
                    className="endorse-btn"
                    onClick={endorseUser}
                    disabled={endorsing}
                  >
                    {endorsing ? '⏳ Endorsing...' : '👍 Endorse User (+5)'}
                  </button>
                )}
              </div>
            </div>
            {message && (
              <div className={`alert ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="stats-section">
            <h2>Statistics</h2>
            <div className="stats-grid-large">
              <div className="stat-card-large">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <div className="stat-value">{profile.total_interactions}</div>
                  <div className="stat-label">Total Interactions</div>
                </div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{profile.positive_interactions}</div>
                  <div className="stat-label">Positive</div>
                </div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {profile.total_interactions > 0 
                      ? Math.round((profile.positive_interactions / profile.total_interactions) * 100)
                      : 0}%
                  </div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
              <div className="stat-card-large">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-value">{profile.badges.length}</div>
                  <div className="stat-label">Badges Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="badges-section-view">
            <h2>🏆 Badges</h2>
            {profile.badges.length > 0 ? (
              <div className="badges-list">
                {profile.badges.map((badge, index) => (
                  <div key={index} className="badge-item-view">
                    <span className="badge-icon">🏅</span>
                    <span className="badge-name">{badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-badges">
                <p>No badges earned yet</p>
              </div>
            )}
          </div>

          <div className="info-section">
            <h2>ℹ️ Information</h2>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">Epoch {profile.created_at}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Profile ID</span>
                <span className="info-value mono">
                  {profile.id.slice(0, 8)}...{profile.id.slice(-6)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value">
                  <span className="status-badge active">Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
