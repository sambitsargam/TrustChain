import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount, useSuiClient } from '@onelabs/dapp-kit';
import '../styles/Analytics.css';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

interface TrustProfile {
  id: string;
  owner: string;
  username: string;
  trust_score: number;
  total_interactions: number;
  positive_interactions: number;
  badges: string[];
  created_at: number;
}

function Analytics() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  
  const [userProfile, setUserProfile] = useState<TrustProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');

  // Dummy data for charts
  const trustScoreHistory = [
    { date: 'Week 1', score: 50 },
    { date: 'Week 2', score: 55 },
    { date: 'Week 3', score: 62 },
    { date: 'Week 4', score: 70 },
    { date: 'Week 5', score: 75 },
    { date: 'Week 6', score: 82 },
    { date: 'Week 7', score: 87 },
    { date: 'Week 8', score: 85 }
  ];

  const interactionData = [
    { type: 'Positive', count: 45, percentage: 75 },
    { type: 'Neutral', count: 10, percentage: 17 },
    { type: 'Negative', count: 5, percentage: 8 }
  ];

  const activityData = [
    { day: 'Mon', interactions: 8 },
    { day: 'Tue', interactions: 12 },
    { day: 'Wed', interactions: 6 },
    { day: 'Thu', interactions: 15 },
    { day: 'Fri', interactions: 10 },
    { day: 'Sat', interactions: 4 },
    { day: 'Sun', interactions: 5 }
  ];

  useEffect(() => {
    if (!account) {
      navigate('/');
    } else {
      fetchUserProfile();
    }
  }, [account, navigate]);

  const fetchUserProfile = async () => {
    if (!account?.address) return;
    
    setLoading(true);
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
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
          setUserProfile({
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

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const maxScore = Math.max(...trustScoreHistory.map(d => d.score));
  const maxActivity = Math.max(...activityData.map(d => d.interactions));

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="analytics-page">
        <div className="error-container">
          <div className="error-icon">📊</div>
          <h2>No Profile Found</h2>
          <p>Create a profile to view your analytics</p>
          <button onClick={() => navigate('/app')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/app')}>
            ← Back
          </button>
          <div>
            <h1>📊 Analytics Dashboard</h1>
            <p>Track your trust score and reputation metrics</p>
          </div>
        </div>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'week' ? 'active' : ''}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={timeframe === 'all' ? 'active' : ''}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <div className="metric-label">Current Trust Score</div>
            <div 
              className="metric-value"
              style={{ color: getTrustScoreColor(userProfile.trust_score) }}
            >
              {userProfile.trust_score}/100
            </div>
            <div className="metric-change positive">+12 this month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-label">Total Interactions</div>
            <div className="metric-value">{userProfile.total_interactions}</div>
            <div className="metric-change positive">+8 this week</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Success Rate</div>
            <div className="metric-value">
              {userProfile.total_interactions > 0 
                ? Math.round((userProfile.positive_interactions / userProfile.total_interactions) * 100)
                : 0}%
            </div>
            <div className="metric-change positive">+5% this month</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-content">
            <div className="metric-label">Badges Earned</div>
            <div className="metric-value">{userProfile.badges.length}</div>
            <div className="metric-change neutral">2 available</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Trust Score Trend */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Trust Score Trend</h3>
            <span className="chart-subtitle">Last 8 weeks</span>
          </div>
          <div className="line-chart">
            <div className="chart-y-axis">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div className="chart-content">
              <svg viewBox="0 0 800 300" className="chart-svg">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 75}
                    x2="800"
                    y2={i * 75}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Line path */}
                <path
                  d={trustScoreHistory.map((point, i) => {
                    const x = (i / (trustScoreHistory.length - 1)) * 800;
                    const y = 300 - (point.score / 100) * 300;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Gradient fill */}
                <path
                  d={`${trustScoreHistory.map((point, i) => {
                    const x = (i / (trustScoreHistory.length - 1)) * 800;
                    const y = 300 - (point.score / 100) * 300;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')} L 800 300 L 0 300 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Data points */}
                {trustScoreHistory.map((point, i) => {
                  const x = (i / (trustScoreHistory.length - 1)) * 800;
                  const y = 300 - (point.score / 100) * 300;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#667eea"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  );
                })}
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(102, 126, 234, 0.3)" />
                    <stop offset="100%" stopColor="rgba(102, 126, 234, 0)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="chart-x-axis">
                {trustScoreHistory.map((point, i) => (
                  <span key={i}>{point.date}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interaction Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Interaction Breakdown</h3>
            <span className="chart-subtitle">All time</span>
          </div>
          <div className="bar-chart">
            {interactionData.map((item, i) => (
              <div key={i} className="bar-item">
                <div className="bar-label">
                  <span>{item.type}</span>
                  <span className="bar-value">{item.count}</span>
                </div>
                <div className="bar-track">
                  <div 
                    className={`bar-fill ${item.type.toLowerCase()}`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="bar-percentage">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <span className="chart-subtitle">This week</span>
          </div>
          <div className="column-chart">
            {activityData.map((item, i) => (
              <div key={i} className="column-item">
                <div 
                  className="column-bar"
                  style={{ height: `${(item.interactions / maxActivity) * 100}%` }}
                >
                  <span className="column-value">{item.interactions}</span>
                </div>
                <div className="column-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="insights-section">
        <h2>📌 Insights & Recommendations</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <h4>Keep Up the Momentum</h4>
            <p>Your trust score increased by 12 points this month. Continue engaging positively with the community!</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🏆</div>
            <h4>Badge Opportunity</h4>
            <p>You're 2 endorsements away from earning the "Trusted Member" badge. Ask trusted connections to endorse you.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h4>Activity Peak</h4>
            <p>Your most active day is Thursday. Consider scheduling important interactions on this day for better engagement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
