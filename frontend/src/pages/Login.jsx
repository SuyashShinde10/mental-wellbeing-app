import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // 1. Save user info to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      alert('Login Successful!');
      
      // 2. ROLE-BASED REDIRECTION LOGIC
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard'); // Default for patients
      }
      
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // --- UI Styles (Kept consistent with your design) ---
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f7f6',
    padding: '20px'
  };

  const cardStyle = {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  };

  const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const buttonStyle = {
    padding: '14px',
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#777', marginBottom: '25px', fontSize: '14px' }}>
            Please login to your MindCare account
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#666' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="example@mail.com" 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#666' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              style={inputStyle} 
              required 
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#777', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;