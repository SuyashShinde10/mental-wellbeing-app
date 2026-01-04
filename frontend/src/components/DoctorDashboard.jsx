import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalNotesMap, setMedicalNotesMap] = useState({}); 
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientTasks, setPatientTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Search States
  const [patientSearch, setPatientSearch] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  // Theme Variables (Matching Patient/Login UI)
  const theme = {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    textMain: '#292524',
    textSec: '#57534E',
    primary: '#6366F1',
    primarySoft: '#E0E7FF',
    success: '#10b981',
    danger: '#ef4444',
    border: '#E7E5E4'
  };

  const fetchData = async () => {
    try {
      const resPatients = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/users/mypatients', config);
      setPatients(resPatients.data);

      const resAppts = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/appointments/admin', config);
      setAppointments(resAppts.data.filter(a => a.doctor?._id === userInfo._id && a.status === 'Confirmed'));

      setIsAvailable(userInfo.isAvailable ?? true);
    } catch (error) { console.error('Error fetching data'); }
  };

  useEffect(() => {
    if (userInfo?.token) { fetchData(); }
    else { navigate('/login'); }
  }, []);

  const handleStatusToggle = async () => {
    try {
      const newStatus = !isAvailable;
      await axios.put('https://mental-wellbeing-app-sandy.vercel.app/api/users/status', { isAvailable: newStatus }, config);
      setIsAvailable(newStatus);
      const updatedUser = { ...userInfo, isAvailable: newStatus };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) { alert('Error updating status'); }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    setTaskSearch('');
    try {
      const { data } = await axios.get(`https://mental-wellbeing-app-sandy.vercel.app/api/tasks/patient/${patient._id}`, config);
      setPatientTasks(data);
    } catch (error) { console.error('Error fetching tasks'); }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTask || !selectedPatient) return;
    try {
      const { data } = await axios.post('https://mental-wellbeing-app-sandy.vercel.app/api/tasks', {
        text: newTask,
        patientId: selectedPatient._id
      }, config);
      setPatientTasks([...patientTasks, data]);
      setNewTask('');
    } catch (error) { alert('Error assigning task'); }
  };

  const handleCompleteAppt = async (apptId) => {
    const notes = medicalNotesMap[apptId];
    if (!notes) return alert("Please enter medical notes.");
    try {
      await axios.put(`https://mental-wellbeing-app-sandy.vercel.app/api/appointments/${apptId}/complete`, { medicalNotes: notes }, config);
      alert('Session Completed!');
      fetchData();
    } catch (error) { alert('Error finalizing appointment'); }
  };

  // Filter Logic
  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));
  const filteredSessions = appointments.filter(appt => 
    appt.patient?.name.toLowerCase().includes(sessionSearch.toLowerCase()) ||
    appt.reason?.toLowerCase().includes(sessionSearch.toLowerCase())
  );
  const filteredTasks = patientTasks.filter(t => 
    t.text.toLowerCase().includes(taskSearch.toLowerCase()) ||
    (t.isCompleted ? 'completed' : 'pending').includes(taskSearch.toLowerCase())
  );

  const cardStyle = { 
    background: theme.surface, 
    padding: '28px', 
    borderRadius: '24px', 
    border: `1px solid ${theme.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    marginBottom: '24px'
  };

  const inputStyle = { 
    width: '100%', 
    padding: '12px', 
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
          .patient-item:hover { background-color: ${theme.primarySoft} !important; }
        `}
      </style>

      {/* HEADER */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `6px solid ${theme.primary}` }}>
        <div>
          <h2 style={{ fontSize: '32px', margin: 0, color: theme.textMain }}>Welcome, <span style={{fontStyle:'italic'}}>Dr. {userInfo?.name}</span></h2>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '14px' }}>
            <span style={{ 
              height: '8px', width: '8px', borderRadius: '50%', 
              backgroundColor: isAvailable ? theme.success : theme.danger, 
              marginRight: '8px' 
            }}></span>
            <span style={{ color: theme.textSec, fontWeight: '500' }}>{isAvailable ? 'Currently Online' : 'Currently Offline'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleStatusToggle}
            style={{ 
              padding: '10px 20px', borderRadius: '50px', 
              border: `1px solid ${isAvailable ? theme.success : theme.danger}`, 
              background: 'transparent', color: isAvailable ? theme.success : theme.danger,
              cursor: 'pointer', fontSize: '12px', fontWeight: '600' 
            }}
          >
            Switch to {isAvailable ? 'Offline 🔴' : 'Online 🟢'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* LEFT COLUMN: PATIENTS & CARE PLAN */}
        <div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '26px', marginBottom: '20px' }}>Managed Patients</h3>
            <input 
              style={{ ...inputStyle, marginBottom: '20px' }} 
              placeholder="Find a patient..." 
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredPatients.map((p) => (
                <div 
                  key={p._id} 
                  className="patient-item"
                  onClick={() => handlePatientClick(p)} 
                  style={{ 
                    padding: '16px', borderRadius: '16px', cursor: 'pointer', marginBottom: '8px',
                    backgroundColor: selectedPatient?._id === p._id ? theme.primarySoft : 'transparent', 
                    border: selectedPatient?._id === p._id ? `1px solid ${theme.primary}` : `1px solid transparent`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', color: theme.textMain }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: theme.textSec }}>{p.email}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: '26px', marginBottom: '8px' }}>Care Plan Manager</h3>
            <p style={{ fontSize: '14px', color: theme.textSec, marginBottom: '20px' }}>
              {selectedPatient ? `Updating plan for ${selectedPatient.name}` : 'Select a patient to assign tasks'}
            </p>
            
            {selectedPatient && (
              <>
                <form onSubmit={handleAssignTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    style={inputStyle} 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="E.g., 10 min daily meditation" 
                  />
                  <button type="submit" style={{ background: theme.textMain, color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}>Add</button>
                </form>

                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {filteredTasks.map(t => (
                    <div key={t._id} style={{ 
                      padding: '14px', backgroundColor: theme.bg, borderRadius: '14px', 
                      marginBottom: '10px', border: `1px solid ${theme.border}` 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{t.text}</span>
                        <span style={{ 
                          fontSize: '10px', padding: '2px 8px', borderRadius: '50px',
                          background: t.isCompleted ? '#D1FAE5' : '#FEF3C7',
                          color: t.isCompleted ? '#065F46' : '#92400E'
                        }}>
                          {t.isCompleted ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SESSIONS */}
        <div>
          <div style={cardStyle}>
            <h3 style={{ fontSize: '26px', marginBottom: '20px' }}>Active Sessions</h3>
            <input 
              style={{ ...inputStyle, marginBottom: '24px' }} 
              placeholder="Search by patient or reason..." 
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
            />
            <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
              {filteredSessions.length === 0 ? (
                <p style={{color: theme.textSec, fontSize: '14px', fontStyle: 'italic'}}>No active confirmed sessions.</p>
              ) : filteredSessions.map(appt => (
                <div key={appt._id} style={{ 
                  padding: '24px', backgroundColor: theme.bg, borderRadius: '20px', 
                  marginBottom: '20px', border: `1px solid ${theme.border}` 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: theme.textMain }}>{appt.patient?.name}</span>
                      <div style={{ fontSize: '12px', color: theme.textSec }}>Reason: {appt.reason}</div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: theme.primary }}>{new Date(appt.appointmentDate).toDateString()}</span>
                  </div>

                  <textarea 
                    placeholder="Summarize the session and findings..." 
                    style={{ 
                      ...inputStyle, height: '100px', background: theme.surface, 
                      marginBottom: '16px', resize: 'none', border: `1px solid ${theme.border}` 
                    }} 
                    value={medicalNotesMap[appt._id] || ''} 
                    onChange={(e) => setMedicalNotesMap({ ...medicalNotesMap, [appt._id]: e.target.value })} 
                  />
                  
                  <button 
                    onClick={() => handleCompleteAppt(appt._id)} 
                    style={{ 
                      background: theme.primary, color: 'white', padding: '14px', 
                      border: 'none', borderRadius: '14px', cursor: 'pointer', 
                      fontWeight: '600', width: '100%', transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.opacity = '0.9'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                  >
                    Finalize Session & Save Notes
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;