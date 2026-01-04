import { Link } from 'react-router-dom';

const Home = () => {
  // Theme Variables
  const colors = {
    primary: '#6366f1', // Modern Indigo
    secondary: '#4f46e5',
    accent: '#10b981', // Success Green
    danger: '#ef4444',
    textDark: '#1e293b',
    textMuted: '#64748b',
    bgLight: '#f8fafc',
  };

  const heroButtonStyle = {
    padding: '16px 44px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: 'white',
    textDecoration: 'none',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '18px',
    display: 'inline-block',
    boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
    transition: 'all 0.3s ease',
  };

  const cardContainerStyle = {
    padding: '40px',
    borderRadius: '24px',
    background: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
    cursor: 'default'
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", backgroundColor: colors.bgLight }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '120px 20px',
        textAlign: 'center',
        background: `radial-gradient(circle at top right, #e0e7ff, transparent), radial-gradient(circle at bottom left, #f1f5f9, transparent)`,
        minHeight: '85vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '200px', height: '200px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <span style={{ 
            padding: '8px 20px', 
            background: 'rgba(99, 102, 241, 0.1)', 
            color: colors.primary, 
            borderRadius: '100px', 
            fontSize: '14px', 
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Supportive Mental Health Platform
          </span>
          
          <h1 style={{ 
            fontSize: 'clamp(40px, 5vw, 64px)', 
            color: colors.textDark, 
            marginBottom: '24px', 
            marginTop: '20px',
            lineHeight: 1.1,
            fontWeight: '800',
            letterSpacing: '-1px'
          }}>
            Your journey to <span style={{ color: colors.primary }}>well-being</span> starts here.
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: colors.textMuted, 
            maxWidth: '600px', 
            margin: '0 auto 40px', 
            lineHeight: '1.7',
            fontWeight: '400'
          }}>
            A compassionate space to track your daily moods, complete wellness tasks, and access instant professional support when you need it most.
          </p>
          
          <Link 
            to="/register" 
            style={heroButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(79, 70, 229, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(79, 70, 229, 0.4)';
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', color: colors.textDark, fontWeight: '800', marginBottom: '16px' }}>How we help you</h2>
          <div style={{ width: '60px', height: '4px', background: colors.primary, margin: '0 auto', borderRadius: '2px' }}></div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px', 
        }}>
          
          {/* Card 1 */}
          <div 
            style={cardContainerStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '20px', 
              background: 'rgba(99, 102, 241, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', marginBottom: '25px' 
            }}>🧘</div>
            <h3 style={{ fontSize: '22px', color: colors.textDark, marginBottom: '15px', fontWeight: '700' }}>Daily Inspiration</h3>
            <p style={{ color: colors.textMuted, lineHeight: '1.6', fontSize: '16px' }}>Receive handpicked motivational insights and quotes curated to strengthen your mental resilience every morning.</p>
          </div>

          {/* Card 2 */}
          <div 
            style={cardContainerStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '20px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', marginBottom: '25px' 
            }}>📈</div>
            <h3 style={{ fontSize: '22px', color: colors.textDark, marginBottom: '15px', fontWeight: '700' }}>Mood Tracking</h3>
            <p style={{ color: colors.textMuted, lineHeight: '1.6', fontSize: '16px' }}>Visualize your emotional patterns over time with intelligent logging that helps you understand your triggers.</p>
          </div>

          {/* Card 3 */}
          <div 
            style={cardContainerStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '20px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', marginBottom: '25px' 
            }}>🚨</div>
            <h3 style={{ fontSize: '22px', color: colors.textDark, marginBottom: '15px', fontWeight: '700' }}>Emergency SOS</h3>
            <p style={{ color: colors.textMuted, lineHeight: '1.6', fontSize: '16px' }}>A single tap notifies your emergency contacts and clinical team with your live location for immediate assistance.</p>
          </div>

        </div>
      </section>

      {/* Footer / CTA Section */}
      <section style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        background: colors.textDark,
        borderRadius: '40px 40px 0 0',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '700' }}>Ready to prioritize yourself?</h2>
        <p style={{ opacity: 0.8, marginBottom: '30px', maxWidth: '500px', margin: '0 auto 40px' }}>Join thousands of others who are taking proactive steps toward a healthier, happier mind.</p>
        <Link 
          to="/register" 
          style={{ ...heroButtonStyle, background: 'white', color: colors.textDark, boxShadow: 'none' }}
        >
          Create Account
        </Link>
      </section>
    </div>
  );
};

export default Home;