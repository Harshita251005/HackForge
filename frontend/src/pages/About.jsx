import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
            About HackForge
          </h1>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              We are dedicated to connecting talented developers, designers, and innovators
              through exciting hackathon events. Our platform makes it easy to discover
              hackathons, form teams, and collaborate on groundbreaking projects.
            </p>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">
                  🎯 Event Discovery
                </h3>
                <p className="text-gray-300">
                  Browse and register for hackathons that match your interests and skills.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">
                  👥 Team Management
                </h3>
                <p className="text-gray-300">
                  Create and join teams, collaborate with like-minded individuals.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">
                  💬 Real-time Communication
                </h3>
                <p className="text-gray-300">
                  Stay connected with your team through our messaging system.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">
                  🔔 Notifications
                </h3>
                <p className="text-gray-300">
                  Get instant updates about events, team invites, and messages.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-gray-300 mb-6">
              Whether you're an experienced developer or just starting out, our platform
              welcomes everyone who's passionate about innovation and collaboration.
            </p>
            <a href="/signup" className="btn-primary inline-block">
              Get Started Today
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
