import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000', {
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        newSocket.emit('join', user.id || user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('newMessage', (message) => {
        // Handle new message
        console.log('New message received:', message);
        // You can dispatch an event or update state here
      });

      newSocket.on('newNotification', (notification) => {
        // Handle new notification
        console.log('New notification received:', notification);
        toast.success(notification.title);
        // Dispatch custom event for notification bell
        window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (data) => {
    if (socket && connected) {
      socket.emit('sendMessage', data);
    }
  };

  const sendNotification = (data) => {
    if (socket && connected) {
      socket.emit('sendNotification', data);
    }
  };

  const emitTyping = (receiverId, isTyping) => {
    if (socket && connected) {
      socket.emit('typing', { receiverId, isTyping });
    }
  };

  const value = {
    socket,
    connected,
    sendMessage,
    sendNotification,
    emitTyping,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
