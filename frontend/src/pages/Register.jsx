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

      // Corrected API endpoint
      await axios.post('http://localhost:5000/api/users', userData);
      alert('Registration Successful! You have been assigned to a Care Admin.');
      navigate('/login');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // UI Styles
  const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f6', padding: '20px' };
  const cardStyle = { background: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' };
  const inputStyle = { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', width: '100%', boxSizing: 'border-box', outline: 'none' };
  const buttonStyle = { padding: '14px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '10px', width: '100%' };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>I am a:</label>
            <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
              <option value="patient">Patient / User</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} style={inputStyle} required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} required />
          <input type="tel" name="phone" placeholder="Personal Phone (+91...)" onChange={handleChange} style={inputStyle} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} style={inputStyle} required />

          {formData.role === 'patient' && (
            <div style={{ border: '1px solid #eef2f1', padding: '15px', borderRadius: '8px', background: '#fcfdfd' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#555', fontSize: '15px' }}>Emergency Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="contactName" placeholder="Name" onChange={handleChange} style={inputStyle} required />
                <input type="tel" name="contactPhone" placeholder="Phone" onChange={handleChange} style={inputStyle} required />
                <input type="text" name="contactRelation" placeholder="Relation (e.g. Mom)" style={inputStyle} onChange={handleChange} required />
              </div>
            </div>
          )}
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#777', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: '#4a90e2', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;