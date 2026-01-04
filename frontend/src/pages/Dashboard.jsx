import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import PatientDashboard from '../components/PatientDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Human-Centric Theme Variables
  const theme = {
    bg: '#FAFAF9',      // Stone white
    surface: 'rgba(255, 255, 255, 0.7)', // Translucent white
    textMain: '#292524', // Warm charcoal
    textSec: '#57534E',  // Stone gray
    border: '#E7E5E4',   // Soft warm border
    danger: '#ef4444',
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!user) return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: theme.bg,
      fontFamily: "'Inter', sans-serif",
      color: theme.textSec
    }}>
      Preparing your space...
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      fontFamily: "'Inter', sans-serif",
      color: theme.textMain
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          
          .dashboard-entry {
            animation: fadeIn 0.8s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Glassmorphism Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 40px', 
        backgroundColor: theme.surface,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <h2 style={{ 
          margin: 0, 
          fontFamily: "'Instrument Serif', serif", 
          fontStyle: 'italic',
          fontSize: '24px',
          fontWeight: '400'
        }}>
          Mindful.
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: theme.textSec }}>
            Welcome, <strong style={{ color: theme.textMain, fontWeight: '600' }}>{user.name}</strong> 
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              padding: '2px 8px',
              backgroundColor: theme.border,
              borderRadius: '4px'
            }}>{user.role}</span>
          </span>
          <button 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 20px', 
              background: 'none', 
              color: theme.danger, 
              border: `1px solid ${theme.danger}`, 
              borderRadius: '50px', 
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = theme.danger;
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = theme.danger;
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content Area */}
      <main className="dashboard-entry" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {user.role === 'admin' && <AdminDashboard />}
          {user.role === 'doctor' && <DoctorDashboard />}
          {user.role === 'patient' && <PatientDashboard />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;