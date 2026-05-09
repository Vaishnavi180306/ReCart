import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';
import './Chat.css';

const API_URL = 'http://localhost:5000/api';

const EMOJIS = ['😊', '👍', '❤️', '😂', '🎉', '🤝', '💰', '📦', '✅', '❌'];

const Chat = () => {
  const { receiverId, productId } = useParams();
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const headers = { Authorization: `Bearer ${user?.token}` };

  // Load chat history, other user info, and product info
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [msgRes, userRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/messages/${receiverId}/${productId}`, { headers }),
          axios.get(`${API_URL}/users/${receiverId}`),
          axios.get(`${API_URL}/products/${productId}`),
        ]);
        setMessages(msgRes.data);
        setOtherUser(userRes.data);
        setProduct(prodRes.data);
      } catch (err) {
        console.error('Failed to load chat data:', err);
      }
    };
    load();
  }, [receiverId, productId, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('userTyping', () => {
      setIsTyping(true);
    });

    socket.on('userStoppedTyping', () => {
      setIsTyping(false);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('onlineUsers');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [socket]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/messages`,
        { receiver: receiverId, product: productId, content: input },
        { headers }
      );

      setMessages((prev) => [...prev, data]);

      // Emit via socket for real-time delivery
      if (socket) {
        socket.emit('sendMessage', { receiverId, message: data });
        socket.emit('stopTyping', { receiverId });
      }

      setInput('');
      setShowEmoji(false);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket) {
      socket.emit('typing', { receiverId, senderName: user.name });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('stopTyping', { receiverId });
      }, 1500);
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
  };

  const isOnline = onlineUsers.includes(receiverId);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return <div className="chat-empty">Please login to chat.</div>;

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className={`chat-avatar ${isOnline ? 'online' : ''}`}>
            {otherUser?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="chat-username">{otherUser?.name || 'Loading...'}</h3>
            <span className="chat-status">{isOnline ? '🟢 Online' : '⚫ Offline'}</span>
          </div>
        </div>
        {product && (
          <div className="chat-product-info">
            <span>Re: {product.title}</span>
            <span className="chat-product-price">₹{product.price?.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-msg">
            <p>👋 Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.sender?._id === user._id || msg.sender === user._id;
          return (
            <div key={msg._id || i} className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
              <p>{msg.content}</p>
              <span className="bubble-time">{formatTime(msg.createdAt)}</span>
            </div>
          );
        })}
        {isTyping && (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar" onSubmit={handleSend}>
        <div className="emoji-container">
          <button type="button" className="emoji-toggle" onClick={() => setShowEmoji(!showEmoji)}>
            😊
          </button>
          {showEmoji && (
            <div className="emoji-picker">
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => addEmoji(e)}>{e}</button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary send-btn">Send</button>
      </form>
    </div>
  );
};

export default Chat;
