import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mrn: '',
    dateOfBirth: '',
    roomNumber: '',
    admittingDiagnosis: '',
    codeStatus: 'Full Code',
    allergies: '',
    attendingPhysician: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`);
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleAddPatient = async () => {
    const required = ['firstName', 'lastName', 'mrn', 'dateOfBirth', 'roomNumber', 'admittingDiagnosis', 'attendingPhysician'];
    for (const field of required) {
      if (!formData[field].trim()) {
        setFormError('Please fill out all required fields.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        allergies: formData.allergies
          ? formData.allergies.split(',').map((a) => a.trim()).filter(Boolean)
          : []
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.message || 'Failed to add patient.');
        setSubmitting(false);
        return;
      }

      await fetchPatients();
      handleCloseModal();
    } catch (error) {
      setFormError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const handleCloseModal = () => {
    setShowAddPatient(false);
    setFormError('');
    setFormData({
      firstName: '',
      lastName: '',
      mrn: '',
      dateOfBirth: '',
      roomNumber: '',
      admittingDiagnosis: '',
      codeStatus: 'Full Code',
      allergies: '',
      attendingPhysician: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>ShiftSync ❤️‍🩹</h1>
          <p>Your Patients Today</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-actions">
        <button className="btn-add-patient" onClick={() => setShowAddPatient(true)}>
          + Add New Patient
        </button>
      </div>

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

      {showAddPatient && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Patient</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name <span className="required">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label>Last Name <span className="required">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>MRN <span className="required">*</span></label>
                  <input type="text" name="mrn" value={formData.mrn} onChange={handleInputChange} placeholder="Medical record number" />
                </div>
                <div className="form-group">
                  <label>Date of Birth <span className="required">*</span></label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Number <span className="required">*</span></label>
                  <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} placeholder="e.g. 204B" />
                </div>
                <div className="form-group">
                  <label>Code Status <span className="required">*</span></label>
                  <select name="codeStatus" value={formData.codeStatus} onChange={handleInputChange}>
                    <option value="Full Code">Full Code</option>
                    <option value="DNR">DNR</option>
                    <option value="DNI">DNI</option>
                    <option value="AND">AND</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Admitting Diagnosis <span className="required">*</span></label>
                <input type="text" name="admittingDiagnosis" value={formData.admittingDiagnosis} onChange={handleInputChange} placeholder="Primary diagnosis" />
              </div>

              <div className="form-group">
                <label>Attending Physician <span className="required">*</span></label>
                <input type="text" name="attendingPhysician" value={formData.attendingPhysician} onChange={handleInputChange} placeholder="Dr. Last Name" />
              </div>

              <div className="form-group">
                <label>Allergies <span className="optional">(comma separated, leave blank if none)</span></label>
                <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="e.g. Penicillin, Latex, Sulfa" />
              </div>

              {formError && <p className="form-error">⚠️ {formError}</p>}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-submit" onClick={handleAddPatient} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;