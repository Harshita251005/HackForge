import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`/events/${id}`);
      if (response.data.success) {
        setEvent(response.data.event);
        if (user) {
          setIsRegistered(
            response.data.event.participants?.some(
              (p) => p._id === user.id || p._id === user._id
            )
          );
        }
      } else {
        console.error('API returned success: false');
        toast.error('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      if (error.response?.status === 404) {
        toast.error('Event not found');
      } else {
        toast.error('Failed to load event');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to register');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/events/${id}/register`);
      if (response.data.success) {
        toast.success('Registered successfully!');
        fetchEvent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleUnregister = async () => {
    try {
      const response = await axios.post(`/events/${id}/unregister`);
      if (response.data.success) {
        toast.success('Unregistered successfully');
        fetchEvent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unregistration failed');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
            <button onClick={() => navigate('/events')} className="btn-primary">
              Back to Events
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
            />
          )}

          <div className="card mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {event.title}
                </h1>
                <p className="text-gray-400">
                  Organized by {event.organizer?.name}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${event.status === 'upcoming'
                    ? 'bg-blue-900/30 text-blue-400'
                    : event.status === 'ongoing'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-gray-900/30 text-gray-400'
                  }`}
              >
                {event.status}
              </span>
            </div>

            <p className="text-gray-300 mb-6">{event.description}</p>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="font-medium">{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">End Date</p>
                  <p className="font-medium">{new Date(event.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {event.venue && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-400">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Max Team Size</p>
                  <p className="font-medium">{event.maxTeamSize} members</p>
                </div>
              </div>
            </div>

            {/* Registration Button */}
            {isAuthenticated && (
              <div className="mt-6">
                {isRegistered ? (
                  <button onClick={handleUnregister} className="btn-secondary">
                    Unregister
                  </button>
                ) : (
                  <button onClick={handleRegister} className="btn-primary">
                    Register for Event
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary-500">
                {event.participants?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Participants</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-secondary-500">
                {event.teams?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">Teams</p>
            </div>
            <div className="card text-center col-span-2 md:col-span-1">
              <p className="text-3xl font-bold text-green-500">{event.maxTeamSize}</p>
              <p className="text-gray-400 text-sm mt-1">Max Team Size</p>
            </div>
          </div>

          {/* Additional Info */}
          {event.prizes && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">🏆 Prizes</h2>
              <div className="text-gray-300 whitespace-pre-line">
                {event.prizes}
              </div>
            </div>
          )}

          {event.rules && (
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-4">📋 Rules</h2>
              <div className="text-gray-300 whitespace-pre-line">
                {event.rules}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
