import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const theme = {
    bg: '#FAFAF9',      // Stone white
    surface: '#FFFFFF', // Pure white for the card
    textMain: '#292524', // Warm charcoal
    textSec: '#57534E',  // Stone gray
    primary: '#6366F1',  // Indigo
    border: '#E7E5E4',   // Soft warm border
    blob1: '#FFD6D6',    // Soft peach
    blob2: '#C7D2FE',    // Soft periwinkle
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://mental-wellbeing-app-sandy.vercel.app/api/users/login', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Login Successful!');
      
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: theme.bg, 
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          
          .input-focus:focus {
            border-color: #6366F1 !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          }
          
          .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -8px rgba(0,0,0,0.15);
          }
        `}
      </style>

      {/* Ambient Background Blobs */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%', width: '400px', height: '400px',
        background: `radial-gradient(circle, ${theme.blob2} 0%, transparent 70%)`,
        opacity: 0.4, filter: 'blur(60px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px',
        background: `radial-gradient(circle, ${theme.blob1} 0%, transparent 70%)`,
        opacity: 0.3, filter: 'blur(60px)', zIndex: 0
      }}></div>

      <div style={{ 
        background: theme.surface, 
        padding: '48px', 
        borderRadius: '32px', 
        border: `1px solid ${theme.border}`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '12px', 
          color: theme.textMain,
          fontFamily: "'Instrument Serif', serif",
          fontSize: '36px',
          fontWeight: '400'
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: theme.textSec, 
          marginBottom: '32px', 
          fontSize: '15px' 
        }}>
          Find your center and continue your journey.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMain, marginLeft: '4px' }}>
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@example.com" 
              onChange={handleChange} 
              className="input-focus"
              style={{
                padding: '14px 16px',
                borderRadius: '16px',
                border: `1px solid ${theme.border}`,
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: theme.bg
              }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMain, marginLeft: '4px' }}>
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              className="input-focus"
              style={{
                padding: '14px 16px',
                borderRadius: '16px',
                border: `1px solid ${theme.border}`,
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: theme.bg
              }} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            style={{
              padding: '16px',
              background: theme.textMain,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginTop: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', color: theme.textSec, fontSize: '14px' }}>
          New here?{' '}
          <Link to="/register" style={{ 
            color: theme.primary, 
            textDecoration: 'none', 
            fontWeight: '600' 
          }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;