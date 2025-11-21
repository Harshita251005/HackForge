import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    venue: '',
    maxTeamSize: '',
    registrationDeadline: '',
    prizes: '',
    rules: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        maxTeamSize: parseInt(formData.maxTeamSize) || 4,
      };

      const response = await axios.post('/events', eventData);

      if (response.data.success) {
        toast.success('Event created successfully!');
        navigate(`/events/${response.data.event._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Event</h1>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Event Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="input-field"
                    placeholder="e.g., Global AI Hackathon 2025"
                    value={formData.title}
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
                    placeholder="Describe your event..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Image</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input-field"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                            setFormData({ ...formData, image: '' });
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    required
                    className="input-field"
                    placeholder="e.g., Online / San Francisco, CA"
                    value={formData.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Schedule</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      required
                      className="input-field"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      required
                      className="input-field"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    required
                    className="input-field"
                    value={formData.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Additional Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Team Size</label>
                  <input
                    type="number"
                    name="maxTeamSize"
                    required
                    min="1"
                    max="10"
                    className="input-field"
                    placeholder="4"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prizes</label>
                  <textarea
                    name="prizes"
                    rows="3"
                    className="input-field"
                    placeholder="e.g., First Place: $10,000, Second Place: $5,000, Third Place: $2,500"
                    value={formData.prizes}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rules & Guidelines</label>
                  <textarea
                    name="rules"
                    rows="4"
                    className="input-field"
                    placeholder="e.g., Teams must be 2-4 members. All code must be written during the event. Use of external APIs is allowed."
                    value={formData.rules}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;