import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PatientDetail.css';

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
    fetchPatientHandoffs();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`);      
const data = await response.json();
      setPatient(data.patient);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setLoading(false);
    }
  };

  const fetchPatientHandoffs = async () => {
    try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`);   
   const data = await response.json();
      setHandoffs(data.handoffs);
    } catch (error) {
      console.error('Error fetching handoffs:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading patient details...</div>;
  }

  if (!patient) {
    return <div className="loading">Patient not found</div>;
  }

  return (
    <div className="patient-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>{patient.firstName} {patient.lastName}</h1>
      </div>

      {/* Patient Info Card */}
      <div className="info-section">
        <div className="info-card">
          <h2>Patient Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>MRN:</strong> {patient.mrn}
            </div>
            <div className="info-item">
              <strong>Room:</strong> {patient.roomNumber}
            </div>
            <div className="info-item">
              <strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
            </div>
            <div className="info-item">
              <strong>Code Status:</strong> {patient.codeStatus}
            </div>
            <div className="info-item">
              <strong>Attending Physician:</strong> {patient.attendingPhysician}
            </div>
            <div className="info-item">
              <strong>Admitting Diagnosis:</strong> {patient.admittingDiagnosis}
            </div>
          </div>

          {/* Allergies */}
          <div className="allergies-section">
            <h3>⚠️ Allergies</h3>
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="allergy-tags">
                {patient.allergies.map((allergy, index) => (
                  <span key={index} className="allergy-tag">{allergy}</span>
                ))}
              </div>
            ) : (
              <p>No known allergies</p>
            )}
          </div>
        </div>
      </div>

      {/* SBAR Button */}
      <div className="action-section">
        <button className="btn-sbar" onClick={() => navigate(`/handoff/${id}`)}>
          Create SBAR Handoff
        </button>
      </div>

      {/* Handoff History */}
      <div className="handoff-section">
        <h2>Shift Handoff History</h2>
        {handoffs.length === 0 ? (
          <div className="no-handoffs">
            <p>No handoffs recorded yet.</p>
            <p>Click "Create SBAR Handoff" to document the first one!</p>
          </div>
        ) : (
          <div className="handoff-list">
            {handoffs.map((handoff) => (
              <div key={handoff._id} className="handoff-card">
                <div className="handoff-header">
                  <span className="handoff-shift">{handoff.shift} Shift</span>
                  <span className="handoff-date">
                    {new Date(handoff.date).toLocaleDateString()} at {new Date(handoff.date).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="sbar-content">
                  <div className="sbar-section">
                    <strong>S - Situation:</strong>
                    <p>{handoff.situation}</p>
                  </div>
                  <div className="sbar-section">
                    <strong>B - Background:</strong>
                    <p>{handoff.background}</p>
                  </div>
                  <div className="sbar-section">
                    <strong>A - Assessment:</strong>
                    <p>{handoff.assessment}</p>
                  </div>
                  <div className="sbar-section">
                    <strong>R - Recommendation:</strong>
                    <p>{handoff.recommendation}</p>
                  </div>
                </div>

                {handoff.urgentFlags && handoff.urgentFlags.length > 0 && (
                  <div className="urgent-flags">
                    <strong>🚨 Urgent Flags:</strong> {handoff.urgentFlags.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetail;