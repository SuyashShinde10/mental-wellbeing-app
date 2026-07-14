import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Home, User, Stethoscope, Shield } from 'lucide-react';

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

  const getDashboardIcon = () => {
    if (!userInfo) return <User size={16} />;
    if (userInfo.role === 'admin') return <Shield size={16} />;
    if (userInfo.role === 'doctor') return <Stethoscope size={16} />;
    return <User size={16} />;
  };

  const theme = {
    bg: 'rgba(250, 250, 249, 0.75)',
    textMain: '#292524',
    textSec: '#57534E',
    primary: '#6366F1',
    danger: '#e11d48',
    border: 'rgba(231, 229, 228, 0.5)',
  };

  const navStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 48px', backgroundColor: theme.bg,
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderBottom: `1px solid ${theme.border}`,
    position: 'sticky', top: 0, zIndex: 1000,
    fontFamily: "'Inter', sans-serif"
  };

  const linkStyle = {
    textDecoration: 'none', color: theme.textSec,
    fontWeight: '500', fontSize: '15px', marginLeft: '32px',
    display: 'flex', alignItems: 'center', gap: '6px',
    cursor: 'pointer', border: 'none', background: 'none'
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={navStyle}
    >
      <Link to={userInfo ? getDashboardPath() : "/"} style={{
        textDecoration: 'none', fontFamily: "'Instrument Serif', serif",
        fontSize: '28px', fontStyle: 'italic', color: theme.textMain,
        letterSpacing: '-0.5px'
      }}>
        Mindful.
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
        {userInfo ? (
          <>
            <motion.button 
              whileHover={{ color: theme.danger, backgroundColor: '#FFE4E6' }}
              onClick={logoutHandler} 
              style={{ ...linkStyle, color: theme.danger, padding: '8px 16px', borderRadius: '50px', transition: 'background-color 0.2s', marginLeft: 'auto' }}
            >
              <LogOut size={16} /> Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              <motion.div whileHover={{ color: theme.textMain }}>Login</motion.div>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none', marginLeft: '24px' }}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: theme.textMain, color: '#ffffff', padding: '10px 24px',
                  borderRadius: '50px', fontWeight: '500', fontSize: '15px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                Join Now
              </motion.div>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;