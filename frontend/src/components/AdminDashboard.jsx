import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorMap, setSelectedDoctorMap] = useState({});
  const [doctorSearch, setDoctorSearch] = useState('');
  const [directorySearch, setDirectorySearch] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  // Human-Centric Theme Variables
  const theme = {
    bg: '#FAFAF9',      // Stone white
    surface: '#FFFFFF', 
    textMain: '#292524', // Warm charcoal
    textSec: '#57534E',  // Stone gray
    primary: '#6366F1',  // Indigo
    primarySoft: '#E0E7FF',
    success: '#10B981',
    successSoft: '#ECFDF5',
    warning: '#F59E0B',
    warningSoft: '#FFFBEB',
    danger: '#EF4444',
    border: '#E7E5E4',
  };

  const fetchData = async () => {
    try {
      const userRes = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/admin/users', config);
      setDoctors(userRes.data.doctors || []);
      setAllPatients(userRes.data.patients || []);
      
      const apptRes = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/appointments/admin', config);
      setAppointments(apptRes.data || []);
    } catch (error) { console.error('Error fetching data'); }
  };

  useEffect(() => { 
      if(!userInfo) navigate('/login');
      else fetchData(); 
  }, []);

  const handleAssignAppt = async (apptId) => {
    const doctorId = selectedDoctorMap[apptId];
    if (!doctorId) return alert("Select a doctor");
    try {
      await axios.put(`https://mental-wellbeing-app-sandy.vercel.app/api/appointments/${apptId}/assign`, { doctorId }, config);
      alert('Doctor Assigned Successfully!');
      fetchData();
    } catch (error) { 
      alert(error.response?.data?.message || "Assignment failed"); 
    }
  };

  const cardStyle = { 
    background: theme.surface, 
    padding: '32px', 
    borderRadius: '24px', 
    border: `1px solid ${theme.border}`, 
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    marginBottom: '24px' 
  };

  const inputStyle = { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '12px', 
    border: `1px solid ${theme.border}`, 
    backgroundColor: theme.bg,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '40px', background: theme.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          h2, h3 { font-family: 'Instrument Serif', serif; font-weight: 400; }
          .admin-table th { font-family: 'Inter', sans-serif; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; color: ${theme.textSec}; }
        `}
      </style>

      {/* HEADER */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${theme.textMain}` }}>
        <div>
          <h2 style={{ fontSize: '36px', margin: 0, color: theme.textMain }}>Panel <span style={{fontStyle:'italic'}}>Control.</span></h2>
          <p style={{ color: theme.textSec, fontSize: '15px', marginTop: '4px' }}>Welcome back, {userInfo?.name}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* GLOBAL DOCTORS LIST */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>Global Network</h3>
          <input 
            style={{ ...inputStyle, marginBottom: '24px' }} 
            placeholder="Search by name or specialty..." 
            onChange={(e) => setDoctorSearch(e.target.value)} 
          />
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).map(d => (
              <div key={d._id} style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                    height: '10px', width: '10px', borderRadius: '50%', marginTop: '8px', 
                    backgroundColor: d.isAvailable ? theme.success : theme.textSec, 
                    marginRight: '16px', flexShrink: 0 
                }}></span>
                
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: theme.textMain, fontSize: '16px' }}>Dr. {d.name}</span>
                    <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '100px', background: d.isAvailable ? theme.successSoft : theme.bg, color: d.isAvailable ? theme.success : theme.textSec, fontWeight: '700' }}>
                        {d.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '13px', color: theme.textSec, marginTop: '4px' }}>{d.email}</div>
                  
                  {/* STATS ROW */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: theme.warning, fontWeight: '700', background: theme.warningSoft, padding: '4px 10px', borderRadius: '8px' }}>
                        ⭐ {d.averageRating || '0.0'}
                    </span>
                    <span style={{ fontSize: '11px', color: theme.primary, fontWeight: '700', background: theme.primarySoft, padding: '4px 10px', borderRadius: '8px' }}>
                        ⏳ {d.pendingSessions || 0} Active
                    </span>
                    <span style={{ fontSize: '11px', color: theme.textSec, fontWeight: '700', background: theme.bg, padding: '4px 10px', borderRadius: '8px' }}>
                        ✅ {d.completedSessions || 0} Total
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PATIENT DIRECTORY */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>Resident Directory</h3>
          <input style={{ ...inputStyle, marginBottom: '24px' }} placeholder="Search all residents..." onChange={(e) => setDirectorySearch(e.target.value)} />
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {allPatients.filter(p => p.name.toLowerCase().includes(directorySearch.toLowerCase())).map(p => (
              <div key={p._id} style={{ padding: '16px', borderRadius: '16px', marginBottom: '8px', border: `1px solid ${theme.border}`, background: theme.bg }}>
                <div style={{ fontWeight: '600', color: theme.textMain, fontSize: '15px' }}>{p.name}</div>
                <div style={{ fontSize: '13px', color: theme.textSec, marginTop: '2px' }}>{p.email}</div>
                <div style={{ fontSize: '11px', color: theme.primary, marginTop: '8px', fontWeight: '500' }}>
                  Managed by: {p.assignedDoctor?.name ? `Dr. ${p.assignedDoctor.name}` : 'Unassigned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* APPOINTMENT REQUESTS TABLE */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '28px', marginBottom: '24px' }}>Care Coordination</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: `2px solid ${theme.border}` }}>
                <th style={{ padding: '16px' }}>Patient</th>
                <th style={{ padding: '16px' }}>Context</th>
                <th style={{ padding: '16px' }}>Assign Care</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appt => (
                <tr key={appt._id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: '20px 16px' }}>
                      <div style={{ fontWeight: '600', color: theme.textMain, fontSize: '14px' }}>{appt.patient?.name}</div>
                      <div style={{ fontSize: '12px', color: theme.textSec }}>{appt.patient?.email}</div>
                  </td>
                  <td style={{ padding: '20px 16px', fontSize: '14px', color: theme.textSec }}>
                    {appt.reason}
                  </td>
                  <td style={{ padding: '20px 16px' }}>
                    {appt.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select 
                          style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}
                          onChange={(e) => setSelectedDoctorMap({...selectedDoctorMap, [appt._id]: e.target.value})}
                        >
                          <option value="">Select Professional</option>
                          {doctors.sort((a, b) => b.isAvailable - a.isAvailable).map(d => (
                            <option key={d._id} value={d._id}>
                              {d.isAvailable ? '🟢' : '🔴'} {d.name} ({d.pendingSessions} active)
                            </option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleAssignAppt(appt._id)} 
                          style={{ background: theme.textMain, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: '600', color: theme.primary, fontSize: '14px' }}>Dr. {appt.doctor?.name}</span>
                    )}
                  </td>
                  <td style={{ padding: '20px 16px' }}>
                    {appt.status === 'Pending' ? (
                      <span style={{ fontSize: '10px', color: theme.warning, fontWeight: '700', background: theme.warningSoft, padding: '4px 10px', borderRadius: '100px' }}>PENDING REVIEW</span>
                    ) : (
                      <div style={{ fontSize: '11px', color: theme.textSec }}>
                        Assigned by {appt.assignedBy?.name} <br/>
                        <span style={{ opacity: 0.6 }}>{new Date(appt.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;