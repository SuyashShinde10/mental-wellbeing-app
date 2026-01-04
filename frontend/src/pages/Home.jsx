import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Human-centric Palette: Warmer, earthier, less "neon"
  const theme = {
    bg: '#FAFAF9', // Stone/Paper white
    surface: '#FFFFFF',
    textMain: '#292524', // Warm charcoal, not pure black
    textSec: '#57534E', // Stone gray
    primary: '#6366F1', // Keeping your indigo, but we'll use it sparingly
    primarySoft: '#E0E7FF',
    accent: '#F0ABFC', // Soft orchid
    success: '#34D399',
    blob1: '#FFD6D6', // Soft peach
    blob2: '#C7D2FE', // Soft periwinkle
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* INJECTING GLOBAL STYLES 
        This adds the fonts and smooth animations that inline styles can't do.
      */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          
          body { margin: 0; }
          
          .human-touch-text {
            font-family: 'Instrument Serif', serif;
            font-style: italic;
          }
          
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
          }

          .card-hover {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
          }

          @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
          }

          /* Grain texture to remove the "digital smoothness" */
          .noise-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 50;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }
        `}
      </style>

      {/* Texture Overlay for "Paper" feel */}
      <div className="noise-overlay"></div>

      {/* Ambient Background Blobs (Organic, not perfect circles) */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px',
        background: `radial-gradient(circle, ${theme.blob2} 0%, transparent 70%)`,
        opacity: 0.5, filter: 'blur(80px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%', width: '500px', height: '500px',
        background: `radial-gradient(circle, ${theme.blob1} 0%, transparent 70%)`,
        opacity: 0.4, filter: 'blur(80px)', zIndex: 0
      }}></div>

      {/* Main Container */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        
        {/* Navigation Placeholder (Minimal) */}
        <nav style={{ padding: '32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* <div style={{ fontWeight: '700', fontSize: '20px', fontFamily: "'Inter', sans-serif", color: theme.textMain }}>
            Mindful.
          </div> */}
          {/* <Link to="/login" style={{ textDecoration: 'none', color: theme.textSec, fontWeight: '500', fontFamily: "'Inter', sans-serif" }}>
            Sign In
          </Link> */}
        </nav>

        {/* HERO SECTION */}
        <header style={{ padding: '80px 0 100px', textAlign: 'center' }}>
          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span style={{ 
              backgroundColor: theme.surface, 
              border: `1px solid ${theme.primarySoft}`,
              color: theme.primary,
              padding: '6px 16px', 
              borderRadius: '100px', 
              fontSize: '13px', 
              fontWeight: '600',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.5px',
              display: 'inline-block',
              marginBottom: '24px'
            }}>
              ✨ A Safe Space for Your Mind
            </span>
          </div>

          <h1 className="fade-in-up" style={{ 
            animationDelay: '0.2s',
            fontSize: 'clamp(48px, 6vw, 76px)', 
            color: theme.textMain, 
            lineHeight: '1.1', 
            fontFamily: "'Instrument Serif', serif", // The Serif font makes it feel human/editorial
            fontWeight: '400',
            marginBottom: '24px',
            letterSpacing: '-1.5px'
          }}>
            Find your balance <br />
            <span style={{ color: theme.textSec, opacity: 0.6 }}>in a noisy world.</span>
          </h1>

          <p className="fade-in-up" style={{ 
            animationDelay: '0.3s',
            fontSize: '18px', 
            color: theme.textSec, 
            maxWidth: '540px', 
            margin: '0 auto 40px', 
            lineHeight: '1.6',
            fontFamily: "'Inter', sans-serif"
          }}>
            Track moods, complete wellness tasks, and access instant support. 
            No algorithms, just a compassionate space for you.
          </p>

          <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/register" 
              style={{ 
                padding: '18px 42px',
                backgroundColor: theme.textMain,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '500',
                fontSize: '16px',
                fontFamily: "'Inter', sans-serif",
                display: 'inline-block',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start your journey
            </Link>
            
            <div style={{ marginTop: '20px', fontSize: '14px', color: theme.textSec, fontFamily: "'Inter', sans-serif" }}>
              Free forever for individuals.
            </div>
          </div>
        </header>

        {/* FEATURES GRID - Bento Style */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', paddingBottom: '120px' }}>
          
          {/* Feature 1 */}
          <div className="card-hover fade-in-up" style={{ 
            animationDelay: '0.5s',
            background: theme.surface, 
            padding: '40px', 
            borderRadius: '24px', 
            border: '1px solid rgba(0,0,0,0.03)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>🧘‍♀️</div>
              <h3 style={{ fontSize: '24px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: theme.textMain }}>Daily Inspiration</h3>
              <p style={{ color: theme.textSec, lineHeight: '1.5', fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
                Handpicked insights curated to strengthen your resilience. Not generated by bots, but written by therapists.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card-hover fade-in-up" style={{ 
            animationDelay: '0.6s',
            background: theme.surface, 
            padding: '40px', 
            borderRadius: '24px', 
            border: '1px solid rgba(0,0,0,0.03)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>🌿</div>
              <h3 style={{ fontSize: '24px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: theme.textMain }}>Mood Patterns</h3>
              <p style={{ color: theme.textSec, lineHeight: '1.5', fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
                Understand your emotional landscape. Visualize your triggers and triumphs over time.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card-hover fade-in-up" style={{ 
            animationDelay: '0.7s',
            background: '#FFF1F2', /* Subtle red tint for SOS */
            padding: '40px', 
            borderRadius: '24px', 
            border: '1px solid rgba(239, 68, 68, 0.05)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ width: '48px', height: '48px', background: '#FECDD3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '20px' }}>❤️</div>
              <h3 style={{ fontSize: '24px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: '#881337' }}>SOS Support</h3>
              <p style={{ color: '#9F1239', lineHeight: '1.5', fontFamily: "'Inter', sans-serif", fontSize: '15px' }}>
                When things get heavy, a single tap notifies your safety circle with your location. You are never alone.
              </p>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default Home;