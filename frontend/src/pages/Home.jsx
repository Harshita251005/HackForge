import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Team Formation',
      description: 'Connect with like-minded developers and form winning teams for hackathons.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4m0-10V9a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2V9z" />
        </svg>
      ),
      title: 'Event Management',
      description: 'Discover and participate in exciting hackathons from around the world.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Real-time Communication',
      description: 'Stay connected with your team and event organizers through instant messaging.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Progress Tracking',
      description: 'Monitor your hackathon journey and showcase your achievements.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Developers' },
    { number: '500+', label: 'Hackathons Hosted' },
    { number: '2K+', label: 'Teams Formed' },
    { number: '50+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build the Future at
              <span className="block gradient-text">HackForge</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate platform for hackathon enthusiasts. Connect with brilliant minds, 
              participate in cutting-edge competitions, and turn your innovative ideas into reality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                    Start Building Today
                  </Link>
                  <Link to="/events" className="btn-outline text-lg px-8 py-4">
                    Explore Events
                  </Link>
                </>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto max-w-4xl">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Developers collaborating at hackathon"
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              HackForge provides all the tools and features you need to participate, 
              organize, and win hackathons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 text-primary-400 rounded-full mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Showcase */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Amazing Hackathons
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From AI and blockchain to sustainability and social impact, 
              discover hackathons that match your passion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sample hackathon cards */}
            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="AI Hackathon"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    AI & ML
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Innovation Challenge</h3>
              <p className="text-gray-400 mb-4">Build the next generation of AI applications</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>48 hours</span>
                <span>$50K Prize Pool</span>
              </div>
            </div>

            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Blockchain Hackathon"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Blockchain
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">DeFi Revolution</h3>
              <p className="text-gray-400 mb-4">Create innovative decentralized finance solutions</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>72 hours</span>
                <span>$75K Prize Pool</span>
              </div>
            </div>

            <div className="card group hover:scale-105 transition-transform duration-300">
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Sustainability Hackathon"
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Sustainability
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Green Tech Challenge</h3>
              <p className="text-gray-400 mb-4">Develop solutions for a sustainable future</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>48 hours</span>
                <span>$30K Prize Pool</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/events" className="btn-primary text-lg px-8 py-4">
              View All Hackathons
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of developers who are already building amazing projects on HackForge.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
                Create Free Account
              </Link>
              <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
