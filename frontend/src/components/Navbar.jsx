import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }

    // Listen for new notifications
    const handleNewNotification = () => {
      fetchNotifications();
    };
    window.addEventListener('newNotification', handleNewNotification);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications.slice(0, 5));
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                HackForge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/events"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/events')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Events
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/teams"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/teams')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  Teams
                </Link>
                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/messages')
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  Messages
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <h3 className="text-white font-semibold">Notifications</h3>
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`px-4 py-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700 ${!notif.isRead ? 'bg-slate-700/50' : ''
                              }`}
                            onClick={() => markAsRead(notif._id)}
                          >
                            <p className="text-white text-sm font-medium">{notif.title}</p>
                            <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/events"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/teams"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Teams
                </Link>
                <Link
                  to="/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
