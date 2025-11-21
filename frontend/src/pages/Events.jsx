import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filter, search]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;

      const response = await axios.get('/events', { params });
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Hackathon Events</h1>
              <p className="text-gray-400">Discover and join exciting hackathons</p>
            </div>
            {user?.role === 'organizer' && (
              <Link to="/events/create" className="btn-primary">
                Create Event
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search events..."
              className="input-field flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input-field md:w-48"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="card hover:scale-105 transition-transform group"
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      📅 {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming'
                        ? 'bg-blue-900/30 text-blue-400'
                        : event.status === 'ongoing'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-gray-900/30 text-gray-400'
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>👥 {event.participants?.length || 0} participants</span>
                      <span>🏆 {event.teams?.length || 0} teams</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-400 text-lg">No events found</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
