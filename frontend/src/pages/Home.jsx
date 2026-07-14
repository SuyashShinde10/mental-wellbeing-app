import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Activity, ShieldAlert, ArrowRight } from 'lucide-react';

const Home = () => {
  const theme = {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    textMain: '#292524',
    textSec: '#57534E',
    primary: '#6366F1',
    primarySoft: '#E0E7FF',
    blob1: '#FFD6D6',
    blob2: '#C7D2FE',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          body { margin: 0; }
          .noise-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 50; opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }
        `}
      </style>
      <div className="noise-overlay"></div>

      {/* Ambient Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: `radial-gradient(circle, ${theme.blob2} 0%, transparent 70%)`, opacity: 0.4, filter: 'blur(80px)', zIndex: 0 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${theme.blob1} 0%, transparent 70%)`, opacity: 0.3, filter: 'blur(80px)', zIndex: 0 }} 
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <nav style={{ padding: '32px 0' }}></nav>

        <motion.header 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ padding: '60px 0 100px', textAlign: 'center' }}
        >
          <motion.div variants={itemVariants}>
            <span style={{ 
              backgroundColor: theme.surface, border: `1px solid ${theme.primarySoft}`, color: theme.primary,
              padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
              fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
            }}>
              <Heart size={14} /> A Safe Space for Your Mind
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ 
            fontSize: 'clamp(48px, 7vw, 84px)', color: theme.textMain, lineHeight: '1.05', 
            fontFamily: "'Instrument Serif', serif", fontWeight: '400', marginBottom: '24px', letterSpacing: '-2px'
          }}>
            Find your balance <br />
            <span style={{ color: theme.textSec, opacity: 0.7 }}>in a noisy world.</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{ 
            fontSize: '19px', color: theme.textSec, maxWidth: '580px', margin: '0 auto 48px', 
            lineHeight: '1.7', fontFamily: "'Inter', sans-serif"
          }}>
            Track moods, complete wellness tasks, and access instant support. 
            No algorithms, just a compassionate space for you and your care team.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{ 
                  padding: '18px 48px', backgroundColor: theme.textMain, color: '#fff', border: 'none',
                  borderRadius: '50px', fontWeight: '500', fontSize: '16px', fontFamily: "'Inter', sans-serif",
                  display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(41, 37, 36, 0.2)'
                }}
              >
                Start your journey <ArrowRight size={18} />
              </motion.button>
            </Link>
            <span style={{ fontSize: '14px', color: theme.textSec, fontFamily: "'Inter', sans-serif" }}>Free forever for individuals.</span>
          </motion.div>
        </motion.header>

        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', paddingBottom: '120px' }}
        >
          {/* Card 1 */}
          <motion.div whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }} style={{ 
            background: theme.surface, padding: '40px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease'
          }}>
            <div style={{ width: '56px', height: '56px', background: '#FEF3C7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#D97706' }}>
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: '26px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: theme.textMain }}>Daily Inspiration</h3>
            <p style={{ color: theme.textSec, lineHeight: '1.6', fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>Handpicked insights curated to strengthen your resilience. Written by real therapists, not bots.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }} style={{ 
            background: theme.surface, padding: '40px', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.03)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease'
          }}>
            <div style={{ width: '56px', height: '56px', background: '#D1FAE5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#059669' }}>
              <Activity size={28} />
            </div>
            <h3 style={{ fontSize: '26px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: theme.textMain }}>Mood Patterns</h3>
            <p style={{ color: theme.textSec, lineHeight: '1.6', fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>Understand your emotional landscape. Visualize your triggers and triumphs over time.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.15)' }} style={{ 
            background: '#FFF1F2', padding: '40px', borderRadius: '32px', border: '1px solid rgba(239, 68, 68, 0.08)',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.05)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease'
          }}>
            <div style={{ width: '56px', height: '56px', background: '#FECDD3', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#E11D48' }}>
              <ShieldAlert size={28} />
            </div>
            <h3 style={{ fontSize: '26px', fontFamily: "'Instrument Serif', serif", marginBottom: '12px', color: '#9F1239' }}>SOS Support</h3>
            <p style={{ color: '#9F1239', opacity: 0.9, lineHeight: '1.6', fontFamily: "'Inter', sans-serif", fontSize: '16px' }}>When things get heavy, a single tap notifies your safety circle with your location. You are never alone.</p>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;