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

  const colors = { primary: '#4f46e5', danger: '#ef4444', border: '#e2e8f0', bg: '#f8fafc', success: '#10b981', offline: '#94a3b8' };
  const cardStyle = { background: '#fff', padding: '24px', borderRadius: '16px', border: `1px solid ${colors.border}`, marginBottom: '20px' };

  return (
    <div style={{ padding: '40px', background: colors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', borderLeft: `6px solid ${colors.primary}` }}>
        <div>
          <h2 style={{ margin: 0 }}>👮 Admin Panel: {userInfo?.name}</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Global Requests & Managed Care</p>
        </div>
        <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }} style={{ background: colors.danger, color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>Logout</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* GLOBAL DOCTORS LIST */}
        <div style={cardStyle}>
          <h3>👨‍⚕️ Global Doctors</h3>
          <input 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }} 
            placeholder="Search doctors..." 
            onChange={(e) => setDoctorSearch(e.target.value)} 
          />
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).map(d => (
              <div key={d._id} style={{ padding: '15px', borderBottom: '1px solid #f1f1f1', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                    height: '10px', width: '10px', borderRadius: '50%', marginTop: '6px', 
                    backgroundColor: d.isAvailable ? colors.success : colors.offline, 
                    marginRight: '12px', flexShrink: 0 
                }}></span>
                
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', color: '#333' }}>{d.name}</span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: d.isAvailable ? '#ecfdf5' : '#f1f5f9', color: d.isAvailable ? '#047857' : '#64748b' }}>
                        {d.isAvailable ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>📧 {d.email}</div>
                  
                  {/* STATS ROW */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
                    {/* Rating */}
                    <span style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 'bold' }}>
                        ⭐ {d.averageRating || '0.0'} <span style={{ color: '#888', fontWeight: 'normal', marginLeft: '4px' }}>({d.reviewCount || 0})</span>
                    </span>
                    {/* Pending Sessions */}
                    <span style={{ color: '#d97706', fontWeight: 'bold', background: '#fffbeb', padding: '2px 6px', borderRadius: '4px' }}>
                        ⏳ {d.pendingSessions || 0} Active
                    </span>
                    {/* Completed */}
                    <span style={{ color: '#059669', fontWeight: 'bold', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                        ✅ {d.completedSessions || 0} Done
                    </span>
                    {/* Total */}
                    <span style={{ color: '#2563eb', fontWeight: 'bold', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                        📊 {d.totalSessions || 0} Total
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PATIENT DIRECTORY */}
        <div style={cardStyle}>
          <h3>👥 My Patient Directory</h3>
          <input style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }} placeholder="Search my patients..." onChange={(e) => setDirectorySearch(e.target.value)} />
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {allPatients.filter(p => p.name.toLowerCase().includes(directorySearch.toLowerCase())).map(p => (
              <div key={p._id} style={{ padding: '12px', borderBottom: '1px solid #f1f1f1' }}>
                <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{p.name}</div>
                <div style={{ fontSize: '13px', color: '#4a5568', marginTop: '4px' }}>📧 {p.email}</div>
                <div style={{ fontSize: '12px', color: '#a0aec0' }}>👨‍⚕️ Doctor: {p.assignedDoctor?.name || 'Unassigned'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* APPOINTMENT REQUESTS TABLE */}
      <div style={cardStyle}>
        <h3>📅 Appointment Requests</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Patient</th>
              <th style={{ padding: '15px' }}>Reason</th>
              <th style={{ padding: '15px' }}>Assignment</th>
              <th style={{ padding: '15px' }}>Status & Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appt => (
              <tr key={appt._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold' }}>{appt.patient?.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{appt.patient?.email}</div>
                </td>
                <td style={{ padding: '15px' }}>{appt.reason}</td>
                <td style={{ padding: '15px' }}>
                  {appt.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select 
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                        onChange={(e) => setSelectedDoctorMap({...selectedDoctorMap, [appt._id]: e.target.value})}
                      >
                        <option value="">Select Doctor</option>
                        {doctors.sort((a, b) => b.isAvailable - a.isAvailable).map(d => (
                          <option key={d._id} value={d._id} style={{ color: d.isAvailable ? 'black' : '#999' }}>
                            {d.isAvailable ? '🟢' : '🔴'} {d.name} ({d.pendingSessions} active)
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleAssignAppt(appt._id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>Assign</button>
                    </div>
                  ) : (
                    <span style={{ fontWeight: 'bold', color: colors.primary }}>Dr. {appt.doctor?.name}</span>
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  {appt.status === 'Pending' ? (
                    <span style={{ color: '#f59e0b', fontWeight: 'bold', background: '#fffbeb', padding: '4px 8px', borderRadius: '4px' }}>GLOBAL REQUEST</span>
                  ) : (
                    <div>
                        <div style={{ color: '#64748b', fontWeight: 'bold' }}>Handled by {appt.assignedBy?.name}</div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                            🕒 {appt.assignmentDate ? `Assigned: ${new Date(appt.assignmentDate).toLocaleString()}` : `Updated: ${new Date(appt.updatedAt).toLocaleString()}`}
                        </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;