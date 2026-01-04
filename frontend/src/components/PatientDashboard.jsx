import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // Theme Variables (Matching Home/Login)
  const theme = {
    bg: '#FAFAF9',
    surface: '#FFFFFF',
    textMain: '#292524',
    textSec: '#57534E',
    primary: '#6366F1',
    primarySoft: '#E0E7FF',
    danger: '#ef4444',
    dangerSoft: '#FFF1F2',
    success: '#10b981',
    border: '#E7E5E4'
  };

  const [user, setUser] = useState({});
  const [quote, setQuote] = useState('');
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppt, setNewAppt] = useState({ date: '', time: '', reason: '' });
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [ratingInput, setRatingInput] = useState({}); 
  const [historySearch, setHistorySearch] = useState('');
  const [ongoingSearch, setOngoingSearch] = useState('');

  const getUserData = () => {
    try { return JSON.parse(localStorage.getItem('userInfo')); } catch (e) { return null; }
  };

  const userInfo = getUserData();
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const quotesList = [
    "You are stronger than you know.", "One day at a time.", "Breathe. It’s just a bad day, not a bad life.", "Small steps are still progress."
  ];

  const fetchTasks = useCallback(async () => {
    if (!userInfo) return;
    try { const { data } = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/tasks', config); setTasks(data); } catch (error) { console.error('Error fetching tasks'); }
  }, [userInfo?.token]);

  const fetchAppointments = useCallback(async () => {
    if (!userInfo) return;
    try { const { data } = await axios.get('https://mental-wellbeing-app-sandy.vercel.app/api/appointments/my', config); setAppointments(data); } catch (error) { console.error('Error fetching appointments'); }
  }, [userInfo?.token]);

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    setUser(userInfo);
    setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
    if (userInfo?.emergencyContacts) setContacts(userInfo.emergencyContacts);
    fetchTasks();
    fetchAppointments();
  }, [navigate, fetchTasks, fetchAppointments]);

  // Actions
  const handleSOS = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await axios.post('https://mental-wellbeing-app-sandy.vercel.app/api/alerts', { latitude, longitude }, config);
          alert('🚨 SOS SENT! Help is on the way.');
        } catch (error) { alert('Failed to send SOS.'); }
      },
      (error) => { alert('Location denied. Cannot send precise SOS.'); }
    );
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!newAppt.date || !newAppt.time || !newAppt.reason) return alert("Please fill all fields.");
    try {
        await axios.post('https://mental-wellbeing-app-sandy.vercel.app/api/appointments', {
            appointmentDate: `${newAppt.date} ${newAppt.time}`,
            reason: newAppt.reason
        }, config);
        alert('Request Sent!');
        fetchAppointments();
        setNewAppt({ date: '', time: '', reason: '' });
    } catch (error) { alert(error.response?.data?.message || "Error"); }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await axios.put(`https://mental-wellbeing-app-sandy.vercel.app/api/tasks/${task._id}`, updatedTask, config);
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
    } catch (error) { alert('Error updating task'); }
  };

  const submitFeedback = async (apptId) => {
      const input = ratingInput[apptId];
      if (!input || !input.rating) return alert("Please select a star rating");
      try {
          await axios.put(`https://mental-wellbeing-app-sandy.vercel.app/api/appointments/${apptId}/feedback`, {
              rating: input.rating,
              feedback: input.feedback
          }, config);
          alert("Thank you for your feedback!");
          fetchAppointments(); 
      } catch (error) { alert("Error submitting feedback"); }
  };

  // Filters
  const filteredHistory = appointments.filter(a => a.status === 'Completed' && (
      a.reason?.toLowerCase().includes(historySearch.toLowerCase()) ||
      a.doctor?.name?.toLowerCase().includes(historySearch.toLowerCase())
  ));

  const filteredOngoing = appointments.filter(a => 
      a.reason?.toLowerCase().includes(ongoingSearch.toLowerCase()) ||
      a.status?.toLowerCase().includes(ongoingSearch.toLowerCase())
  );

  const cardStyle = { 
    background: theme.surface, 
    padding: '24px', 
    borderRadius: '24px', 
    border: `1px solid ${theme.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
  };

  const inputStyle = { 
    padding: '12px', 
    borderRadius: '12px', 
    border: `1px solid ${theme.border}`, 
    backgroundColor: theme.bg,
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ padding: '40px', background: theme.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
          h2, h4, .serif { font-family: 'Instrument Serif', serif; font-weight: 400; }
          .status-badge { padding: 4px 10px; borderRadius: 100px; fontSize: 11px; fontWeight: 600; textTransform: uppercase; letterSpacing: 0.5px; }
        `}
      </style>

      {/* Header */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderLeft: `6px solid ${theme.primary}` }}>
        <div>
          <h2 style={{ fontSize: '32px', margin: 0, color: theme.textMain }}>Welcome, <span style={{fontStyle:'italic'}}>{user?.name}</span></h2>
          <p style={{ margin: '4px 0 0 0', color: theme.textSec, fontSize: '15px' }}>Your mindful space for the day.</p>
        </div>
        <div style={{ background: theme.primarySoft, padding: '12px 20px', borderRadius: '16px', color: theme.primary, fontStyle: 'italic', fontSize: '14px', maxWidth: '300px' }}>
          "{quote}"
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SOS */}
          <div style={{ ...cardStyle, background: theme.dangerSoft, border: `1px solid #FECDD3`, textAlign: 'center' }}>
            <h4 style={{ color: '#9F1239', fontSize: '24px', margin: '0 0 12px 0' }}>Need Immediate Help?</h4>
            <p style={{ color: '#BE123C', fontSize: '14px', marginBottom: '20px' }}>Clicking this will notify your doctor and emergency contacts.</p>
            <button onClick={handleSOS} style={{ padding: '14px 40px', background: theme.danger, color: 'white', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', transition: '0.3s' }}>SEND SOS ALERT</button>
          </div>

          {/* Contacts */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Trusted Contacts</h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <input style={inputStyle} placeholder="Name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
              <input style={inputStyle} placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
              <button onClick={handleAddContact} style={{ padding: '10px 20px', background: theme.textMain, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Add</button>
            </div>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: `1px solid ${theme.border}`, fontSize: '14px' }}>
                <span><strong>{c.name}</strong> — {c.phone}</span>
                <button onClick={() => handleDeleteContact(i)} style={{ color: theme.danger, border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Your Care Plan</h4>
            {tasks.length === 0 ? <p style={{color: theme.textSec, fontSize: '14px'}}>No active tasks today.</p> : tasks.map(t => (
                <div key={t._id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${theme.border}`, alignItems: 'center' }}>
                  <input type="checkbox" checked={t.isCompleted} onChange={() => handleToggleTask(t)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <span style={{ textDecoration: t.isCompleted ? 'line-through' : 'none', color: t.isCompleted ? theme.border : theme.textMain, fontSize: '15px' }}>{t.text}</span>
                </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Booking */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Request a Session</h4>
            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="date" required style={inputStyle} value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} />
                <input type="time" required style={inputStyle} value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} />
              </div>
              <input type="text" placeholder="What's on your mind?" style={inputStyle} value={newAppt.reason} onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })} required />
              <button type="submit" style={{ background: theme.primary, color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '600', cursor: 'pointer' }}>Submit Request</button>
            </form>
          </div>

          {/* Ongoing Status */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Appointment Status</h4>
            <input style={{ ...inputStyle, marginBottom: '16px' }} placeholder="Search requests..." value={ongoingSearch} onChange={(e) => setOngoingSearch(e.target.value)} />
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {filteredOngoing.map(appt => (
                  <div key={appt._id} style={{ background: theme.bg, padding: '16px', borderRadius: '16px', marginBottom: '12px', border: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{fontWeight:'600', fontSize:'14px', color: theme.textMain}}>{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                        <span className="status-badge" style={{ 
                          background: appt.status === 'Confirmed' ? '#D1FAE5' : '#FEF3C7', 
                          color: appt.status === 'Confirmed' ? '#065F46' : '#92400E' 
                        }}>{appt.status}</span>
                    </div>
                    {appt.doctor && (
                        <div style={{ fontSize: '13px', color: theme.textSec, lineHeight: '1.6' }}>
                            👨‍⚕️ Dr. {appt.doctor.name} <br/> 📧 {appt.doctor.email}
                        </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* History */}
          <div style={cardStyle}>
            <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Clinical History</h4>
            <input style={{ ...inputStyle, marginBottom: '16px' }} placeholder="Search past sessions..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {filteredHistory.map(appt => (
                <div key={appt._id} style={{ padding: '16px', borderRadius: '16px', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{fontSize: '14px'}}>{new Date(appt.appointmentDate).toLocaleDateString()}</strong>
                    <span style={{ fontSize: '12px', color: theme.textSec }}>Dr. {appt.doctor?.name}</span>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: '14px', fontStyle: 'italic' }}>"{appt.reason}"</p>
                  <div style={{ background: theme.bg, padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '8px', color: theme.textMain }}>
                    <strong>Notes:</strong> {appt.medicalNotes}
                  </div>
                  
                  {!appt.rating && (
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${theme.border}` }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>How was this session?</p>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                          {[1,2,3,4,5].map(star => (
                              <span key={star} style={{ cursor: 'pointer', fontSize: '20px', color: (ratingInput[appt._id]?.rating || 0) >= star ? '#F59E0B' : theme.border }}
                                  onClick={() => setRatingInput({ ...ratingInput, [appt._id]: { ...ratingInput[appt._id], rating: star } })}>★</span>
                          ))}
                      </div>
                      <div style={{display:'flex', gap:'8px'}}>
                        <input style={{...inputStyle, padding:'8px'}} placeholder="Review..." value={ratingInput[appt._id]?.feedback || ''} onChange={(e) => setRatingInput({ ...ratingInput, [appt._id]: { ...ratingInput[appt._id], feedback: e.target.value } })} />
                        <button onClick={() => submitFeedback(appt._id)} style={{ padding: '8px 16px', background: theme.success, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Submit</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;