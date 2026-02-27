import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Handoff.css';

function Handoff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    shift: 'day',
    situation: '',
    background: '',
    assessment: '',
    recommendation: '',
    urgentFlags: '',
    familyConcerns: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    medications: [{ medication: '', time: '', route: '' }],
    tasks: [{ task: '', priority: 'medium' }]
  });

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${id}`);
      const data = await response.json();
      setPatient(data.patient);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patient:', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...formData.medications];
    updated[index][field] = value;
    setFormData({ ...formData, medications: updated });
  };

  const addMed = () => {
    setFormData({ ...formData, medications: [...formData.medications, { medication: '', time: '', route: '' }] });
  };

  const removeMed = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: updated });
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...formData.tasks];
    updated[index][field] = value;
    setFormData({ ...formData, tasks: updated });
  };

  const addTask = () => {
    setFormData({ ...formData, tasks: [...formData.tasks, { task: '', priority: 'medium' }] });
  };

  const removeTask = (index) => {
    const updated = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: updated });
  };

  const handleSubmit = async () => {
    if (!formData.situation.trim() || !formData.background.trim() || !formData.assessment.trim() || !formData.recommendation.trim()) {
      setError('Please complete all four SBAR fields (Situation, Background, Assessment, Recommendation).');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const vitals = {};
      if (formData.bloodPressure) vitals.bloodPressure = Number(formData.bloodPressure);
      if (formData.heartRate) vitals.heartRate = Number(formData.heartRate);
      if (formData.temperature) vitals.temperature = Number(formData.temperature);
      if (formData.oxygenSaturation) vitals.oxygenSaturation = Number(formData.oxygenSaturation);
      if (formData.respiratoryRate) vitals.respiratoryRate = Number(formData.respiratoryRate);

      const payload = {
        patient: id,
        shift: formData.shift,
        situation: formData.situation,
        background: formData.background,
        assessment: formData.assessment,
        recommendation: formData.recommendation,
        urgentFlags: formData.urgentFlags
          ? formData.urgentFlags.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
        familyConcerns: formData.familyConcerns,
        vitals,
        medicationsDue: formData.medications.filter((m) => m.medication.trim()),
        pendingTasks: formData.tasks.filter((t) => t.task.trim())
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/handoffs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to submit handoff.');
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="loading">Loading patient info...</div>;
  if (!patient) return <div className="loading">Patient not found.</div>;

  if (submitSuccess) {
    return (
      <div className="handoff-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Handoff Submitted!</h2>
          <p>The SBAR handoff for <strong>{patient.firstName} {patient.lastName}</strong> has been saved successfully.</p>
          <div className="success-actions">
            <button className="btn-back" onClick={() => navigate(`/patient/${id}`)}>Back to Patient</button>
            <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="handoff-container">
      <div className="handoff-header">
        <button className="btn-back" onClick={() => navigate(`/patient/${id}`)}>← Back to Patient</button>
        <div className="header-info">
          <h1>SBAR Handoff</h1>
          <p>{patient.firstName} {patient.lastName} — Room {patient.roomNumber}</p>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div className="allergy-alert">
          🚨 <strong>ALLERGY ALERT:</strong> {patient.allergies.join(', ')}
        </div>
      )}

      <div className="section-card">
        <h2>Shift Information</h2>
        <div className="shift-selector">
          <label className={`shift-option ${formData.shift === 'day' ? 'active' : ''}`}>
            <input type="radio" name="shift" value="day" checked={formData.shift === 'day'} onChange={handleChange} />
            ☀️ Day Shift
          </label>
          <label className={`shift-option ${formData.shift === 'night' ? 'active' : ''}`}>
            <input type="radio" name="shift" value="night" checked={formData.shift === 'night'} onChange={handleChange} />
            🌙 Night Shift
          </label>
        </div>
      </div>

      <div className="section-card sbar-card">
        <h2>SBAR Report</h2>
        <div className="sbar-field">
          <label className="sbar-label sbar-s"><span className="sbar-letter">S</span> Situation <span className="sbar-hint">What is happening right now?</span></label>
          <textarea name="situation" value={formData.situation} onChange={handleChange} placeholder="Briefly describe the current patient situation, reason for handoff, and any acute concerns..." rows={4} />
        </div>
        <div className="sbar-field">
          <label className="sbar-label sbar-b"><span className="sbar-letter">B</span> Background <span className="sbar-hint">Relevant clinical history</span></label>
          <textarea name="background" value={formData.background} onChange={handleChange} placeholder="Admitting diagnosis, relevant PMH, procedures done, current treatments, IV access, diet, activity level..." rows={4} />
        </div>
        <div className="sbar-field">
          <label className="sbar-label sbar-a"><span className="sbar-letter">A</span> Assessment <span className="sbar-hint">Your clinical impression</span></label>
          <textarea name="assessment" value={formData.assessment} onChange={handleChange} placeholder="Your assessment of the patient's current status, trends, and clinical concerns..." rows={4} />
        </div>
        <div className="sbar-field">
          <label className="sbar-label sbar-r"><span className="sbar-letter">R</span> Recommendation <span className="sbar-hint">What needs to happen next</span></label>
          <textarea name="recommendation" value={formData.recommendation} onChange={handleChange} placeholder="Orders to follow up on, pending labs/imaging, things to watch for, PRN medications available..." rows={4} />
        </div>
      </div>

      <div className="section-card">
        <h2>Current Vitals <span className="optional-label">(optional)</span></h2>
        <div className="vitals-grid">
          <div className="vital-item"><label>BP (systolic)</label><input type="number" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="120" /><span className="unit">mmHg</span></div>
          <div className="vital-item"><label>Heart Rate</label><input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} placeholder="72" /><span className="unit">bpm</span></div>
          <div className="vital-item"><label>Temperature</label><input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="98.6" step="0.1" /><span className="unit">°F</span></div>
          <div className="vital-item"><label>O2 Sat</label><input type="number" name="oxygenSaturation" value={formData.oxygenSaturation} onChange={handleChange} placeholder="98" /><span className="unit">%</span></div>
          <div className="vital-item"><label>Resp Rate</label><input type="number" name="respiratoryRate" value={formData.respiratoryRate} onChange={handleChange} placeholder="16" /><span className="unit">br/min</span></div>
        </div>
      </div>

      <div className="section-card">
        <h2>Medications Due <span className="optional-label">(optional)</span></h2>
        <div className="dynamic-list">
          {formData.medications.map((med, index) => (
            <div key={index} className="dynamic-row">
              <input type="text" placeholder="Medication name" value={med.medication} onChange={(e) => handleMedChange(index, 'medication', e.target.value)} />
              <input type="text" placeholder="Time (e.g. 1400)" value={med.time} onChange={(e) => handleMedChange(index, 'time', e.target.value)} />
              <input type="text" placeholder="Route (PO, IV, etc)" value={med.route} onChange={(e) => handleMedChange(index, 'route', e.target.value)} />
              {formData.medications.length > 1 && <button className="btn-remove" onClick={() => removeMed(index)}>✕</button>}
            </div>
          ))}
        </div>
        <button className="btn-add-row" onClick={addMed}>+ Add Medication</button>
      </div>

      <div className="section-card">
        <h2>Pending Tasks <span className="optional-label">(optional)</span></h2>
        <div className="dynamic-list">
          {formData.tasks.map((task, index) => (
            <div key={index} className="dynamic-row">
              <input type="text" placeholder="Task description" value={task.task} onChange={(e) => handleTaskChange(index, 'task', e.target.value)} style={{ flex: 2 }} />
              <select value={task.priority} onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {formData.tasks.length > 1 && <button className="btn-remove" onClick={() => removeTask(index)}>✕</button>}
            </div>
          ))}
        </div>
        <button className="btn-add-row" onClick={addTask}>+ Add Task</button>
      </div>

      <div className="section-card">
        <h2>Additional Notes <span className="optional-label">(optional)</span></h2>
        <div className="form-group">
          <label>🚨 Urgent Flags <span className="optional-label">(comma separated)</span></label>
          <input type="text" name="urgentFlags" value={formData.urgentFlags} onChange={handleChange} placeholder="e.g. Pending cardiology consult, critical lab value, fall risk" />
        </div>
        <div className="form-group">
          <label>👨‍👩‍👧 Family Concerns</label>
          <textarea name="familyConcerns" value={formData.familyConcerns} onChange={handleChange} placeholder="Any family concerns, visitors expected, communication needs..." rows={3} />
        </div>
      </div>

      {error && <div className="submit-error">⚠️ {error}</div>}

      <div className="submit-section">
        <button className="btn-cancel-handoff" onClick={() => navigate(`/patient/${id}`)}>Cancel</button>
        <button className="btn-submit-handoff" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : '✓ Submit Handoff'}
        </button>
      </div>
    </div>
  );
}

export default Handoff;