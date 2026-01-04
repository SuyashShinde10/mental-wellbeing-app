const Footer = () => {
  const footerStyle = {
    padding: '40px 50px',
    background: '#2d3748',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 'auto'
  };

  return (
    <footer style={footerStyle}>
      <h3 style={{ marginBottom: '10px' }}>MindCare</h3>
      <p style={{ fontSize: '14px', color: '#a0aec0', marginBottom: '20px' }}>
        Empowering mental health through technology and immediate care.
      </p>
      <div style={{ borderTop: '1px solid #4a5568', paddingTop: '20px', fontSize: '12px', color: '#718096' }}>
        © 2026 MindCare Health Systems. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;