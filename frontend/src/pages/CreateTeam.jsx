import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const CreateTeam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    eventId: '',
    description: '',
    requiredSkills: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      // Filter only upcoming events
      const upcomingEvents = response.data.events.filter(
        event => new Date(event.endDate) > new Date()
      );
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const teamData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
      };

      const response = await axios.post('/teams', teamData);

      if (response.data.success) {
        toast.success('Team created successfully!');
        navigate(`/teams/${response.data.team._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Team</h1>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Event</label>
                <select
                  name="eventId"
                  required
                  className="input-field"
                  value={formData.eventId}
                  onChange={handleChange}
                >
                  <option value="">Select an event...</option>
                  {events.map(event => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  placeholder="e.g., Code Warriors"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  className="input-field"
                  placeholder="Describe your team and what you're building..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills (comma separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  className="input-field"
                  placeholder="e.g., React, Node.js, UI Design"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/teams')}
                  className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8"
                >
                  {loading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTeam;
