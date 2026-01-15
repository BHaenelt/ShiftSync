const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  mrn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  admittingDiagnosis: {
    type: String,
    required: true
  },
  codeStatus: {
    type: String,
    enum: ['Full Code', 'DNR', 'DNI', 'AND'],
    required: true
  },
  allergies: [{
    type: String
  }],
  attendingPhysician: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);