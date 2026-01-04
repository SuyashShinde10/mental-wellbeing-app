import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'patient',
    contactName: '',
    contactPhone: '',
    contactRelation: '',
  });

  const navigate = useNavigate();

  // Theme Variables
  const theme = {
    bg: '#FAFAF9',      // Stone white
    surface: '#FFFFFF', 
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
      const emergencyContacts = formData.role === 'patient' ? [
        {
          name: formData.contactName,
          phone: formData.contactPhone,
          relation: formData.contactRelation,
        },
      ] : [];

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        emergencyContacts: emergencyContacts,
      };

      await axios.post('https://mental-wellbeing-app-sandy.vercel.app/api/users', userData);
      alert('Registration Successful! You have been assigned to a Care Admin.');
      navigate('/login');
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
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          
          .input-focus:focus {
            border-color: #6366F1 !important;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          }
          
          .reg-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -8px rgba(0,0,0,0.15);
          }
        `}
      </style>

      {/* Ambient Background Blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px',
        background: `radial-gradient(circle, ${theme.blob2} 0%, transparent 70%)`,
        opacity: 0.3, filter: 'blur(80px)', zIndex: 0
      }}></div>

      <div style={{ 
        background: theme.surface, 
        padding: '48px', 
        borderRadius: '32px', 
        border: `1px solid ${theme.border}`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '480px',
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
          Begin your <span style={{fontStyle: 'italic'}}>journey.</span>
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: theme.textSec, 
          marginBottom: '32px', 
          fontSize: '15px',
          lineHeight: '1.5'
        }}>
          Join our community and get the <br/> support you deserve.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMain, marginLeft: '4px' }}>I am a...</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bg,
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="patient">Patient / User</option>
              <option value="doctor">Professional Doctor</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="input-focus" style={{ padding: '14px 16px', borderRadius: '14px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', backgroundColor: theme.bg }} required />
            <input type="tel" name="phone" placeholder="Phone (+91...)" onChange={handleChange} className="input-focus" style={{ padding: '14px 16px', borderRadius: '14px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', backgroundColor: theme.bg }} required />
          </div>

          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="input-focus" style={{ padding: '14px 16px', borderRadius: '14px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', backgroundColor: theme.bg }} required />
          <input type="password" name="password" placeholder="Create Password" onChange={handleChange} className="input-focus" style={{ padding: '14px 16px', borderRadius: '14px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', backgroundColor: theme.bg }} required />

          {formData.role === 'patient' && (
            <div style={{ 
              marginTop: '10px',
              padding: '20px', 
              borderRadius: '20px', 
              background: theme.blob1 + '33', // 20% opacity of the peach blob
              border: `1px solid ${theme.blob1}`
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                color: theme.textMain, 
                fontSize: '16px',
                fontFamily: "'Instrument Serif', serif" 
              }}>
                Emergency Safety Circle
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" name="contactName" placeholder="Contact Name" onChange={handleChange} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid white', fontSize: '14px', outline: 'none' }} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="tel" name="contactPhone" placeholder="Phone" onChange={handleChange} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid white', fontSize: '14px', outline: 'none' }} required />
                  <input type="text" name="contactRelation" placeholder="Relation" onChange={handleChange} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid white', fontSize: '14px', outline: 'none' }} required />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="reg-btn"
            style={{
              padding: '16px',
              background: theme.textMain,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginTop: '10px',
              transition: 'all 0.3s'
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', color: theme.textSec, fontSize: '14px' }}>
          Already a member?{' '}
          <Link to="/login" style={{ 
            color: theme.primary, 
            textDecoration: 'none', 
            fontWeight: '600' 
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;