import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`/teams/${id}`);
      setTeam(response.data.team);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to load team details');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!user) {
      toast.error('Please login to join a team');
      navigate('/login');
      return;
    }

    setJoining(true);
    try {
      const response = await axios.post(`/teams/${id}/join`);
      if (response.data.success) {
        toast.success('Joined team successfully!');
        fetchTeamDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join team');
    } finally {
      setJoining(false);
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

  if (!team) return null;

  const isMember = team.members.some(member => member._id === user?._id);
  const isLeader = team.leader._id === user?._id;
  const isFull = team.members.length >= (team.event?.maxTeamSize || 4);

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
                <p className="text-primary font-medium mb-4">
                  Event: {team.event?.title}
                </p>
                <p className="text-gray-300">{team.description}</p>
              </div>

              {!isMember && (
                <button
                  onClick={handleJoinTeam}
                  disabled={joining || isFull}
                  className={`btn-primary ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {joining ? 'Joining...' : isFull ? 'Team Full' : 'Join Team'}
                </button>
              )}

              {isMember && (
                <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                  You are a member
                </span>
              )}
            </div>

            {/* Skills */}
            {team.requiredSkills && team.requiredSkills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Looking for:</h3>
                <div className="flex flex-wrap gap-2">
                  {team.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member._id} className="card flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {member.name}
                        {team.leader._id === member._id && (
                          <span className="ml-2 text-xs text-primary border border-primary px-2 py-0.5 rounded-full">
                            Leader
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Placeholder */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Team Chat</h2>
              <div className="card h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400">
                  {isMember
                    ? "Chat functionality coming soon..."
                    : "Join the team to access chat"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetails;
