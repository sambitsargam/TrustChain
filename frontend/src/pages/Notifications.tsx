import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import '../styles/Notifications.css';

interface Notification {
  id: string;
  type: 'endorsement' | 'badge' | 'message' | 'profile' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

function Notifications() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'endorsements' | 'badges' | 'messages'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'endorsement',
      title: 'New Endorsement',
      message: 'alice_crypto endorsed you! Your trust score increased by +5 points.',
      timestamp: Date.now() - 300000,
      read: false,
      actionUrl: '/profile/0x1234...5678',
      actionLabel: 'View Profile'
    },
    {
      id: '2',
      type: 'badge',
      title: 'Badge Earned!',
      message: 'Congratulations! You earned the "Early Adopter" badge.',
      timestamp: Date.now() - 3600000,
      read: false,
      actionUrl: '/app',
      actionLabel: 'View Badges'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'bob_blockchain sent you a message: "Would you like to collaborate?"',
      timestamp: Date.now() - 7200000,
      read: true,
      actionUrl: '/messages',
      actionLabel: 'Reply'
    },
    {
      id: '4',
      type: 'profile',
      title: 'Profile View',
      message: 'charlie_dev viewed your profile.',
      timestamp: Date.now() - 10800000,
      read: true,
      actionUrl: '/profile/0xabcd...efgh',
      actionLabel: 'View Profile'
    },
    {
      id: '5',
      type: 'endorsement',
      title: 'Endorsement Received',
      message: 'david_chain endorsed you! +5 trust score.',
      timestamp: Date.now() - 14400000,
      read: true
    },
    {
      id: '6',
      type: 'system',
      title: 'Trust Score Updated',
      message: 'Your AI-calculated trust score has been updated to 87/100.',
      timestamp: Date.now() - 18000000,
      read: true,
      actionUrl: '/analytics',
      actionLabel: 'View Analytics'
    },
    {
      id: '7',
      type: 'badge',
      title: 'Badge Milestone',
      message: 'You\'re close to earning the "Trusted Member" badge! Complete 5 more interactions.',
      timestamp: Date.now() - 21600000,
      read: true
    },
    {
      id: '8',
      type: 'message',
      title: 'New Message',
      message: 'eve_crypto sent you a message.',
      timestamp: Date.now() - 86400000,
      read: true,
      actionUrl: '/messages',
      actionLabel: 'View'
    }
  ]);

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleAction = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'endorsement': return '👍';
      case 'badge': return '🏆';
      case 'message': return '💬';
      case 'profile': return '👤';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'endorsements') return notif.type === 'endorsement';
    if (filter === 'badges') return notif.type === 'badge';
    if (filter === 'messages') return notif.type === 'message';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/app')}>
            ← Back
          </button>
          <h1>🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}</h1>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button 
          className={`filter-btn ${filter === 'endorsements' ? 'active' : ''}`}
          onClick={() => setFilter('endorsements')}
        >
          👍 Endorsements
        </button>
        <button 
          className={`filter-btn ${filter === 'badges' ? 'active' : ''}`}
          onClick={() => setFilter('badges')}
        >
          🏆 Badges
        </button>
        <button 
          className={`filter-btn ${filter === 'messages' ? 'active' : ''}`}
          onClick={() => setFilter('messages')}
        >
          💬 Messages
        </button>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className={`notification-icon ${notif.type}`}>
                {getNotificationIcon(notif.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <div>
                    <div className="notification-title">{notif.title}</div>
                    <div className="notification-time">{formatTime(notif.timestamp)}</div>
                  </div>
                </div>
                <div className="notification-message">{notif.message}</div>
                {notif.actionUrl && (
                  <div className="notification-actions">
                    <button 
                      className="notif-action-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(notif);
                      }}
                    >
                      {notif.actionLabel || 'View'}
                    </button>
                    {!notif.read && (
                      <button 
                        className="notif-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-notifications">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      )}
    </div>
  );
}

export default Notifications;
