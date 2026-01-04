import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // State Management
  const [user, setUser] = useState({});
  const [quote, setQuote] = useState('');
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newAppt, setNewAppt] = useState({ date: '', time: '', reason: '' });
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  // Rating State
  const [ratingInput, setRatingInput] = useState({}); 

  // Search States
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

  // --- ACTIONS ---
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

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const updatedContacts = [...contacts, newContact];
    try {
      const { data } = await axios.put('https://mental-wellbeing-app-sandy.vercel.app/api/users/contacts', { contacts: updatedContacts }, config);
      setContacts(data.emergencyContacts);
      const updatedUser = { ...userInfo, emergencyContacts: data.emergencyContacts };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNewContact({ name: '', phone: '' });
    } catch (error) { alert('Error saving contact'); }
  };

  const handleDeleteContact = async (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    try {
      const { data } = await axios.put('https://mental-wellbeing-app-sandy.vercel.app/api/users/contacts', { contacts: updatedContacts }, config);
      setContacts(data.emergencyContacts);
      const updatedUser = { ...userInfo, emergencyContacts: data.emergencyContacts };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) { alert('Error deleting contact'); }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await axios.put(`https://mental-wellbeing-app-sandy.vercel.app/api/tasks/${task._id}`, updatedTask, config);
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
    } catch (error) { alert('Error updating task'); }
  };

  const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };

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

  // --- FILTER LOGIC ---
  const filteredHistory = appointments.filter(a => a.status === 'Completed' && (
      a.reason?.toLowerCase().includes(historySearch.toLowerCase()) ||
      a.doctor?.name?.toLowerCase().includes(historySearch.toLowerCase())
  ));

  const filteredOngoing = appointments.filter(a => 
      a.reason?.toLowerCase().includes(ongoingSearch.toLowerCase()) ||
      a.status?.toLowerCase().includes(ongoingSearch.toLowerCase())
  );

  // --- STYLES ---
  const cardStyle = { background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eee' };
  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '10px' };

  // Helper for Status Badge Color
  const getStatusStyle = (status) => {
    switch(status) {
        case 'Confirmed': return { bg: '#c6f6d5', color: '#22543d' }; // Green
        case 'Completed': return { bg: '#bee3f8', color: '#2b6cb0' }; // Blue
        case 'Cancelled': return { bg: '#fed7d7', color: '#9b2c2c' }; // Red
        default: return { bg: '#feebc8', color: '#744210' };          // Yellow (Pending)
    }
  };

  return (
    <div style={{ padding: '30px', background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderTop: '4px solid #00acc1' }}>
        <div>
          <h2 style={{ margin: 0 }}>👤 Patient Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome back: {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: '#e0f7fa', padding: '10px 15px', borderRadius: '10px', fontStyle: 'italic', fontSize: '13px' }}>"{quote}"</div>
            <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ ...cardStyle, background: '#fff5f5', borderColor: '#feb2b2', textAlign: 'center' }}>
            <h3 style={{ color: '#c53030', margin: '0 0 10px 0' }}>🚨 SOS Assistance</h3>
            <button onClick={handleSOS} style={{ padding: '12px 30px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>SEND ALERT</button>
          </div>

          <div style={cardStyle}>
            <h4>📞 Trusted Contacts</h4>
            <form onSubmit={handleAddContact} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input style={{ flex: 1, ...inputStyle, marginBottom: 0 }} placeholder="Name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} required />
              <input style={{ flex: 1, ...inputStyle, marginBottom: 0 }} placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} required />
              <button type="submit" style={{ padding: '0 15px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
            </form>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                  <span>{c.name}: {c.phone}</span>
                  <button onClick={() => handleDeleteContact(i)} style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h4>📝 Care Plan Tasks</h4>
            {tasks.length === 0 ? <p style={{color:'#888'}}>No tasks.</p> : tasks.map(t => (
                <div key={t._id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <input type="checkbox" checked={t.isCompleted} onChange={() => handleToggleTask(t)} />
                  <span style={{ textDecoration: t.isCompleted ? 'line-through' : 'none', color: t.isCompleted ? '#aaa' : '#333' }}>{t.text}</span>
                </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={cardStyle}>
            <h4>📅 Book Appointment</h4>
            <form onSubmit={handleBookAppointment} style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="date" required style={inputStyle} value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} />
              <input type="time" required style={inputStyle} value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} />
              <input type="text" placeholder="Reason" style={inputStyle} value={newAppt.reason} onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })} required />
              <button type="submit" style={{ background: '#4a90e2', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Request</button>
            </form>
          </div>

          {/* ONGOING REQUESTS (Updated with Email) */}
          <div style={cardStyle}>
            <h4>⏳ Appointment Status</h4>
            <input type="text" placeholder="Search..." style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', marginBottom:'10px'}} value={ongoingSearch} onChange={(e) => setOngoingSearch(e.target.value)} />
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredOngoing.map(appt => {
                  const style = getStatusStyle(appt.status);
                  return (
                    <div key={appt._id} style={{ background: '#fcfcfc', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{fontWeight:'bold', fontSize:'13px'}}>{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                          {/* STATUS BADGE */}
                          <span style={{ fontSize: '11px', background: style.bg, color: style.color, padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {appt.status.toUpperCase()}
                          </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Reason: {appt.reason}</div>
                      
                      {/* Show Doctor info if Confirmed OR Completed */}
                      {(appt.status === 'Confirmed' || appt.status === 'Completed') && appt.doctor && (
                          <div style={{ marginTop: '5px', fontSize: '12px', color: style.color }}>
                              {/* THIS IS THE FIXED LINE: */}
                              👨‍⚕️ Dr. {appt.doctor.name} | 📧 {appt.doctor.email} | 📞 {appt.doctor.phone}
                          </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* MEDICAL HISTORY */}
          <div style={cardStyle}>
            <h4>📜 Medical History & Feedback</h4>
            <input type="text" placeholder="Search..." style={{width:'100%', padding:'8px', borderRadius:'6px', border:'1px solid #ddd', marginBottom:'10px'}} value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredHistory.map(appt => (
                <div key={appt._id} style={{ background: '#f8fbff', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '5px solid #3498db' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{new Date(appt.appointmentDate).toLocaleDateString()}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>Dr. {appt.doctor?.name}</span>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '13px' }}>Reason: {appt.reason}</p>
                  <p style={{ fontSize: '13px', background: '#fff', padding: '8px', borderRadius: '4px' }}>Notes: {appt.medicalNotes}</p>
                  
                  {/* FEEDBACK SECTION */}
                  <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    {appt.rating ? (
                        <div style={{ color: '#f1c40f', fontWeight: 'bold' }}>
                            {"★".repeat(appt.rating)}{"☆".repeat(5-appt.rating)} 
                            <span style={{ color: '#333', fontWeight: 'normal', fontSize: '13px', marginLeft: '8px' }}>
                                "{appt.feedback}"
                            </span>
                        </div>
                    ) : (
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Rate your therapy:</p>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                {[1,2,3,4,5].map(star => (
                                    <span 
                                        key={star} 
                                        style={{ cursor: 'pointer', fontSize: '20px', color: (ratingInput[appt._id]?.rating || 0) >= star ? '#f1c40f' : '#ccc' }}
                                        onClick={() => setRatingInput({ ...ratingInput, [appt._id]: { ...ratingInput[appt._id], rating: star } })}
                                    >★</span>
                                ))}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Write a review..." 
                                style={{ width: '70%', padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '12px' }}
                                value={ratingInput[appt._id]?.feedback || ''}
                                onChange={(e) => setRatingInput({ ...ratingInput, [appt._id]: { ...ratingInput[appt._id], feedback: e.target.value } })}
                            />
                            <button 
                                onClick={() => submitFeedback(appt._id)}
                                style={{ marginLeft: '8px', padding: '5px 10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >Submit</button>
                        </div>
                    )}
                  </div>
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