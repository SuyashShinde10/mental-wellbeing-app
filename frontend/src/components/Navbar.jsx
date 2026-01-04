import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // We parse this inside the component body to get the latest data on each render
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  // Helper to get the correct dashboard path based on role
  const getDashboardPath = () => {
    if (!userInfo) return '/login';
    if (userInfo.role === 'admin') return '/admin-dashboard';
    if (userInfo.role === 'doctor') return '/doctor-dashboard';
    return '/patient-dashboard';
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    background: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#4a90e2',
    fontWeight: '600',
    margin: '0 15px',
    cursor: 'pointer'
  };

  return (
    <nav style={navStyle}>
      {/* Clicking the logo now takes users to their specific dashboard if logged in */}
      <Link to={userInfo ? getDashboardPath() : "/"} style={{ ...linkStyle, fontSize: '22px', color: '#333' }}>
        🧠 MindCare
      </Link>
      
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        
        {userInfo ? (
          <>
            {/* Added a dynamic Dashboard link so users don't get stuck on a blank page */}
            <Link to={getDashboardPath()} style={linkStyle}>Dashboard</Link>
            <button 
              onClick={logoutHandler} 
              style={{ ...linkStyle, border: 'none', background: 'none', color: '#e53e3e', fontSize: '16px' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={{ ...linkStyle, background: '#4a90e2', color: 'white', padding: '8px 18px', borderRadius: '8px' }}>Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;