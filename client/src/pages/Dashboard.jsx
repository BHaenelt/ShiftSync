import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const navigate = useNavigate();

  // Fetch patients when component loads
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      setPatients(data.patients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>ShiftSync ❤️‍🩹</h1>
          <p>Your Patients Today</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Add Patient Button */}
      <div className="dashboard-actions">
        <button 
          className="btn-add-patient"
          onClick={() => setShowAddPatient(true)}
        >
          + Add New Patient
        </button>
      </div>

      {/* Patient List */}
      <div className="patients-grid">
        {patients.length === 0 ? (
          <div className="no-patients">
            <p>No patients assigned yet.</p>
            <p>Click "Add New Patient" to get started!</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div 
              key={patient._id} 
              className="patient-card"
              onClick={() => handlePatientClick(patient._id)}
            >
              <div className="patient-header">
                <h3>{patient.firstName} {patient.lastName}</h3>
                <span className="room-number">Room {patient.roomNumber}</span>
              </div>
              <div className="patient-info">
                <p><strong>MRN:</strong> {patient.mrn}</p>
                <p><strong>Diagnosis:</strong> {patient.admittingDiagnosis}</p>
                <p><strong>Code Status:</strong> {patient.codeStatus}</p>
                {patient.allergies && patient.allergies.length > 0 && (
                  <p className="allergies">
                    <strong>⚠️ Allergies:</strong> {patient.allergies.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;