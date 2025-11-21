import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from '../lib/axios';
import { format } from 'date-fns';

const Messages = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);

      // Join the team room
      if (socket && connected) {
        socket.emit('joinRoom', `team_${activeConversation._id}`);
      }
    }

    return () => {
      if (activeConversation) {
        socket?.emit('leave_chat', activeConversation._id);
      }
    };
  }, [activeConversation, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Check if message belongs to current conversation
      // The backend sends teamId for team messages
      const isCurrentChat =
        (message.teamId === activeConversation._id) ||
        (message.chatId === activeConversation._id) ||
        (message.sender._id === activeConversation._id) || // For direct messages
        (message.receiver._id === activeConversation._id); // For direct messages

      // Don't add if it's our own message (already added optimistically)
      const isMyMessage = message.sender._id === user._id || message.sender === user._id;

      if (activeConversation && isCurrentChat && !isMyMessage) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/users/my-teams');
      setConversations(response.data.teams);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/messages/${chatId}`);
      setMessages(response.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const messageData = {
        content: newMessage,
        chatId: activeConversation._id,
      };

      // Optimistic update
      const optimisticMessage = {
        _id: Date.now().toString(),
        content: newMessage,
        sender: { _id: user._id, name: user.name },
        createdAt: new Date().toISOString(),
        chatId: activeConversation._id,
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      scrollToBottom();

      // Send to server
      await axios.post('/messages', messageData);

      // Socket emission is handled by backend and received via 'receive_message'
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex gap-6">
          {/* Sidebar - Conversations */}
          <div className="w-1/3 card flex flex-col p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No teams yet. Join a team to start chatting!
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors ${activeConversation?._id === conv._id ? 'bg-gray-700/50 border-l-4 border-l-primary' : ''
                      }`}
                  >
                    <h3 className="font-bold text-white">{conv.name}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {conv.event?.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 card flex flex-col p-0 overflow-hidden">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                  <h3 className="text-xl font-bold text-white">{activeConversation.name}</h3>
                  <p className="text-sm text-gray-400">{activeConversation.members.length} members</p>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => {
                    const isMe = msg.sender._id === user?._id;
                    const showAvatar = index === 0 || messages[index - 1].sender._id !== msg.sender._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white mr-2 mt-1">
                            {msg.sender.name.charAt(0)}
                          </div>
                        )}
                        {!isMe && !showAvatar && <div className="w-10" />}

                        <div className={`max-w-[70%] ${isMe ? 'bg-primary text-white' : 'bg-gray-700 text-gray-200'} rounded-lg px-4 py-2`}>
                          {!isMe && showAvatar && (
                            <p className="text-xs font-bold mb-1 opacity-75">{msg.sender.name}</p>
                          )}
                          <p>{msg.content}</p>
                          <p className="text-[10px] opacity-50 text-right mt-1">
                            {format(new Date(msg.createdAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input-field flex-1"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="btn-primary px-6"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
