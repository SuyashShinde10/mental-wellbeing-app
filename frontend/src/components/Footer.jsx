import React from 'react';

const Footer = () => {
  // Matching the "Human" Home page theme
  const theme = {
    bg: '#FAFAF9',      // Stone/Paper white
    textMain: '#292524', // Warm charcoal
    textSec: '#57534E',  // Stone gray
    border: '#E7E5E4',   // Soft warm border
    accent: '#6366F1',   // Indigo
  };

  return (
    <footer style={{ 
      backgroundColor: theme.bg, 
      padding: '80px 24px 40px', 
      borderTop: `1px solid ${theme.border}`,
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          {/* Logo with the Serif font */}
          <h3 style={{ 
            fontFamily: "'Instrument Serif', serif", 
            fontSize: '32px', 
            fontWeight: '400', 
            fontStyle: 'italic',
            color: theme.textMain,
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px'
          }}>
            Mindful.
          </h3>
          
          <p style={{ 
            fontSize: '16px', 
            color: theme.textSec, 
            maxWidth: '400px', 
            lineHeight: '1.6',
            margin: 0 
          }}>
            A compassionate space built to help you find balance and resilience in your daily life.
          </p>
        </div>

        {/* Bottom Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '32px',
          borderTop: `1px solid ${theme.border}`,
          fontSize: '13px',
          color: theme.textSec,
          letterSpacing: '0.2px'
        }}>
          <div>
            © 2026 MindCare Health. 
            <span style={{ marginLeft: '12px', opacity: 0.6 }}>Designed for Humans.</span>
          </div>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: theme.textMain, textDecoration: 'none', fontWeight: '500' }}>Privacy</a>
            <a href="#" style={{ color: theme.textMain, textDecoration: 'none', fontWeight: '500' }}>Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;