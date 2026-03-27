import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@onelabs/dapp-kit';
import '../styles/Messages.css';

interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  address: string;
  username: string;
  lastMessage: string;
  timestamp: number;
  unread: number;
  trustScore: number;
}

function Messages() {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      address: '0x1234...5678',
      username: 'alice_crypto',
      lastMessage: 'Thanks for the endorsement!',
      timestamp: Date.now() - 300000,
      unread: 2,
      trustScore: 85
    },
    {
      address: '0x8765...4321',
      username: 'bob_blockchain',
      lastMessage: 'Would you like to collaborate?',
      timestamp: Date.now() - 3600000,
      unread: 0,
      trustScore: 72
    },
    {
      address: '0xabcd...efgh',
      username: 'charlie_dev',
      lastMessage: 'Great working with you!',
      timestamp: Date.now() - 7200000,
      unread: 1,
      trustScore: 91
    }
  ]);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.address);
    }
  }, [selectedConversation]);

  const loadMessages = (address: string) => {
    // Dummy messages for demonstration
    const dummyMessages: Message[] = [
      {
        id: '1',
        sender: address,
        senderName: selectedConversation?.username || 'User',
        content: 'Hey! I saw your profile on TrustChain.',
        timestamp: Date.now() - 7200000,
        read: true
      },
      {
        id: '2',
        sender: account?.address || '',
        senderName: 'You',
        content: 'Hi! Thanks for reaching out.',
        timestamp: Date.now() - 7000000,
        read: true
      },
      {
        id: '3',
        sender: address,
        senderName: selectedConversation?.username || 'User',
        content: 'Your trust score is impressive! Would love to connect.',
        timestamp: Date.now() - 3600000,
        read: true
      },
      {
        id: '4',
        sender: account?.address || '',
        senderName: 'You',
        content: 'Thank you! Always happy to connect with trusted members.',
        timestamp: Date.now() - 3500000,
        read: true
      },
      {
        id: '5',
        sender: address,
        senderName: selectedConversation?.username || 'User',
        content: selectedConversation?.lastMessage || 'Latest message',
        timestamp: selectedConversation?.timestamp || Date.now(),
        read: false
      }
    ];
    setMessages(dummyMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: account?.address || '',
      senderName: 'You',
      content: newMessage,
      timestamp: Date.now(),
      read: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Update conversation
    setConversations(conversations.map(conv => 
      conv.address === selectedConversation.address
        ? { ...conv, lastMessage: newMessage, timestamp: Date.now() }
        : conv
    ));
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="messages-header">
        <button className="back-btn" onClick={() => navigate('/app')}>
          ← Back
        </button>
        <h1>💬 Messages</h1>
      </div>

      <div className="messages-container">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Conversations</h2>
            <button className="new-message-btn">✉️ New</button>
          </div>

          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.map((conv) => (
              <div
                key={conv.address}
                className={`conversation-item ${selectedConversation?.address === conv.address ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conv-avatar">
                  {conv.username.charAt(0).toUpperCase()}
                </div>
                <div className="conv-info">
                  <div className="conv-header">
                    <span className="conv-username">{conv.username}</span>
                    <span className="conv-time">{formatTime(conv.timestamp)}</span>
                  </div>
                  <div className="conv-preview">
                    <span className="last-message">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="unread-badge">{conv.unread}</span>
                    )}
                  </div>
                  <div className="conv-trust">
                    <span 
                      className="trust-indicator"
                      style={{ color: getTrustScoreColor(conv.trustScore) }}
                    >
                      ⭐ {conv.trustScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedConversation.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConversation.username}</h3>
                    <p className="chat-address">{selectedConversation.address}</p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="action-btn"
                    onClick={() => navigate(`/profile/${selectedConversation.address}`)}
                  >
                    👤 View Profile
                  </button>
                </div>
              </div>

              <div className="messages-area">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender === account?.address ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-area">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!newMessage.trim()}>
                  Send 📤
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="empty-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
