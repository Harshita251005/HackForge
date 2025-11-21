import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    teams: 0,
    messages: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, teamsRes] = await Promise.all([
        axios.get('/users/my-events'),
        axios.get('/users/my-teams'),
      ]);

      if (eventsRes.data.success) {
        setRecentEvents(eventsRes.data.events.slice(0, 3));
        setStats(prev => ({ ...prev, events: eventsRes.data.events.length }));
      }

      if (teamsRes.data.success) {
        setMyTeams(teamsRes.data.teams.slice(0, 3));
        setStats(prev => ({ ...prev, teams: teamsRes.data.teams.length }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-400">Here's what's happening with your hackathons</p>

            {!user?.isEmailVerified && (
              <div className="mt-4 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Please verify your email to create or join teams. Check your inbox for the verification link.
                </p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Events Joined</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.events}</p>
                </div>
                <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">My Teams</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.teams}</p>
                </div>
                <div className="w-12 h-12 bg-secondary-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-3xl font-bold text-white mt-1 capitalize">{user?.role}</p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/events" className="card hover:border-primary-500 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Browse Events</span>
              </div>
            </Link>

            <Link to="/teams" className="card hover:border-secondary-500 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">My Teams</span>
              </div>
            </Link>

            <Link to="/messages" className="card hover:border-green-500 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Messages</span>
              </div>
            </Link>

            <Link to="/profile" className="card hover:border-yellow-500 transition-all group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-white font-medium">My Profile</span>
              </div>
            </Link>
          </div>

          {/* Recent Events and Teams */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Recent Events</h2>
                <Link to="/events" className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event) => (
                    <Link key={event._id} to={`/events/${event._id}`} className="card hover:border-primary-500 transition-all block">
                      <div className="flex items-start space-x-4">
                        {event.image && (
                          <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{event.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {new Date(event.startDate).toLocaleDateString()}
                          </p>
                          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${event.status === 'upcoming' ? 'bg-blue-900/30 text-blue-400' :
                              event.status === 'ongoing' ? 'bg-green-900/30 text-green-400' :
                                'bg-gray-900/30 text-gray-400'
                            }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <p className="text-gray-400">No events joined yet</p>
                    <Link to="/events" className="btn-primary mt-4 inline-block">
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* My Teams */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">My Teams</h2>
                <Link to="/teams" className="text-secondary-500 hover:text-secondary-400 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {myTeams.length > 0 ? (
                  myTeams.map((team) => (
                    <Link key={team._id} to={`/teams/${team._id}`} className="card hover:border-secondary-500 transition-all block">
                      <div>
                        <h3 className="text-white font-semibold">{team.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          {team.event?.title}
                        </p>
                        <div className="flex items-center mt-3 space-x-2">
                          <div className="flex -space-x-2">
                            {team.members?.slice(0, 3).map((member, idx) => (
                              <div key={idx} className="w-8 h-8 rounded-full bg-primary-600 border-2 border-slate-800 flex items-center justify-center">
                                {member.profilePicture ? (
                                  <img src={member.profilePicture} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <span className="text-white text-xs">{member.name?.charAt(0)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">
                            {team.members?.length} members
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <p className="text-gray-400">No teams yet</p>
                    {user?.isEmailVerified ? (
                      <Link to="/teams/create" className="btn-secondary mt-4 inline-block">
                        Create Team
                      </Link>
                    ) : (
                      <p className="text-yellow-400 text-sm mt-2">Verify your email to create teams</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
