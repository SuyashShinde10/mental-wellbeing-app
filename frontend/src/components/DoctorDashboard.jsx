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
  const [taskSearch, setTaskSearch] = useState(''); // NEW: Search for tasks

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchData = async () => {
    try {
      // Fetch Patients assigned to this doctor
      const resPatients = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/users/mypatients', config);
      setPatients(resPatients.data);

      // Fetch Appointments (Sessions)
      const resAppts = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/appointments/admin', config);
      // Filter for confirmed appointments assigned to this doctor
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
    setTaskSearch(''); // Reset search when switching patients
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

  const handleDeleteTask = async (taskId) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    try {
        await axios.delete(`https://mental-wellbeing-app-sandy.vercel.app/api/tasks/${taskId}`, config);
        setPatientTasks(patientTasks.filter(t => t._id !== taskId));
    } catch (error) { alert('Error deleting task'); }
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

  // --- FILTER LOGIC ---
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredSessions = appointments.filter(appt => 
    appt.patient?.name.toLowerCase().includes(sessionSearch.toLowerCase()) ||
    appt.reason?.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  // NEW: Filter Tasks Logic
  const filteredTasks = patientTasks.filter(t => 
    t.text.toLowerCase().includes(taskSearch.toLowerCase()) ||
    (t.isCompleted ? 'completed' : 'pending').includes(taskSearch.toLowerCase())
  );

  const cardStyle = { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' };
  const searchInputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '10px', fontSize: '14px', outline: 'none' };

  return (
    <div style={{ padding: '30px', background: '#f0f4f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid #4a90e2' }}>
        <div>
          <h2 style={{ margin: 0 }}>👨‍⚕️ Doctor Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            <strong>Dr. {userInfo?.name}</strong> | Status: 
            <span style={{ color: isAvailable ? '#10b981' : '#ef4444', fontWeight: 'bold', marginLeft: '5px' }}>
                {isAvailable ? 'ONLINE' : 'OFFLINE'}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={handleStatusToggle}
              style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #ddd', background: isAvailable ? '#f0fff4' : '#fff5f5', cursor: 'pointer', fontSize: '12px' }}
            >
              Set {isAvailable ? 'Offline 🔴' : 'Online 🟢'}
            </button>
            <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }} style={{ padding: '10px 20px', background: '#4a5568', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* LEFT COLUMN: PATIENTS & CARE PLAN */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* My Patients List */}
          <div style={cardStyle}>
            <h3 style={{ borderBottom: '2px solid #f0f4f8', paddingBottom: '10px' }}>My Patients</h3>
            <input 
              type="text" 
              placeholder="Search patients..." 
              style={searchInputStyle}
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {filteredPatients.map((p) => (
                <li 
                  key={p._id} 
                  onClick={() => handlePatientClick(p)} 
                  style={{ 
                    padding: '12px', 
                    borderBottom: '1px solid #eee', 
                    cursor: 'pointer', 
                    background: selectedPatient?._id === p._id ? '#ebf8ff' : 'transparent', 
                    borderRadius: '8px', 
                    marginBottom: '5px',
                    borderLeft: selectedPatient?._id === p._id ? '4px solid #3182ce' : 'none'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#718096' }}>{p.email}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Care Plan Manager */}
          <div style={cardStyle}>
            <h3>Care Plan: {selectedPatient ? selectedPatient.name : <span style={{color:'#ccc'}}>Select a Patient</span>}</h3>
            
            {selectedPatient && (
              <>
                {/* Add Task Form */}
                <form onSubmit={handleAssignTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="Assign new task..." 
                    style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }} 
                  />
                  <button type="submit" style={{ background: '#3182ce', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Add</button>
                </form>

                <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }} />

                {/* Task Search */}
                <input 
                    type="text" 
                    placeholder="Search history or status..." 
                    style={searchInputStyle}
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                />

                {/* Task History List */}
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {filteredTasks.length === 0 ? (
                    <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '13px' }}>No tasks found.</p>
                  ) : (
                    filteredTasks.map(t => (
                      <div key={t._id} style={{ fontSize: '13px', padding: '10px', background: '#f7fafc', borderRadius: '6px', marginBottom: '8px', border: '1px solid #edf2f7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                           <span style={{ fontWeight: '600', color: '#2d3748' }}>{t.text}</span>
                           <button onClick={() => handleDeleteTask(t._id)} style={{ border: 'none', background: 'transparent', color: '#e53e3e', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#718096' }}>
                                Assigned: {new Date(t.createdAt).toLocaleDateString()}
                            </span>
                            <span style={{ 
                                fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold',
                                background: t.isCompleted ? '#c6f6d5' : '#feebc8',
                                color: t.isCompleted ? '#22543d' : '#744210'
                            }}>
                                {t.isCompleted ? '✅ Completed' : '⏳ Pending'}
                            </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SESSIONS */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={cardStyle}>
            <h3 style={{ borderBottom: '2px solid #f0f4f8', paddingBottom: '10px' }}>Active Sessions</h3>
            <input 
              type="text" 
              placeholder="Search active sessions..." 
              style={searchInputStyle}
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
            />
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredSessions.length === 0 ? <p style={{color:'#888'}}>No active confirmed sessions.</p> : filteredSessions.map(appt => (
                <div key={appt._id} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px', background: '#fff' }}>
                  <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2b6cb0' }}>{appt.patient?.name || "Unknown"}</span>
                        <span style={{ fontSize: '12px', color: '#718096' }}>{new Date(appt.appointmentDate).toDateString()}</span>
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#4a5568' }}><strong>Reason:</strong> {appt.reason}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#718096' }}>📧 {appt.patient?.email}</p>
                  </div>

                  <textarea 
                    placeholder="Enter clinical notes here..." 
                    style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', marginBottom: '10px', fontSize: '13px' }} 
                    value={medicalNotesMap[appt._id] || ''} 
                    onChange={(e) => setMedicalNotesMap({ ...medicalNotesMap, [appt._id]: e.target.value })} 
                  />
                  <button 
                    onClick={() => handleCompleteAppt(appt._id)} 
                    style={{ background: '#48bb78', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                  >
                    Complete Session & Save Notes
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