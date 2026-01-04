import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!userInfo) return '/login';
    if (userInfo.role === 'admin') return '/admin-dashboard';
    if (userInfo.role === 'doctor') return '/doctor-dashboard';
    return '/patient-dashboard';
  };

  // Human-Centric Theme Matching
  const theme = {
    bg: 'rgba(250, 250, 249, 0.8)', // Translucent stone/paper
    textMain: '#292524', // Warm charcoal
    textSec: '#57534E',  // Stone gray
    primary: '#6366F1',  // Indigo
    danger: '#ef4444',
    border: '#E7E5E4',
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: theme.bg,
    backdropFilter: 'blur(10px)', // Adds a soft glass effect
    borderBottom: `1px solid ${theme.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif"
  };

  const linkStyle = {
    textDecoration: 'none',
    color: theme.textSec,
    fontWeight: '500',
    fontSize: '15px',
    marginLeft: '30px',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    background: 'none'
  };

  const logoStyle = {
    textDecoration: 'none',
    fontFamily: "'Instrument Serif', serif",
    fontSize: '26px',
    fontStyle: 'italic',
    color: theme.textMain,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const joinBtnStyle = {
    ...linkStyle,
    backgroundColor: theme.textMain,
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: '50px',
    fontWeight: '500',
    transition: 'transform 0.2s ease'
  };

  return (
    <nav style={navStyle}>
      {/* Brand Logo */}
      <Link to={userInfo ? getDashboardPath() : "/"} style={logoStyle}>
        Mindful.
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        
        {userInfo ? (
          <>
            <Link to={getDashboardPath()} style={linkStyle}>Dashboard</Link>
            <button 
              onClick={logoutHandler} 
              style={{ ...linkStyle, color: theme.danger }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link 
              to="/register" 
              style={joinBtnStyle}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;