import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Import your Dashboard components
// Change these imports to match your actual folder structure
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  {/* Ensure these paths match the navigate strings in Login.jsx */}
  <Route path="/patient-dashboard" element={<PatientDashboard />} />
  <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
</Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;