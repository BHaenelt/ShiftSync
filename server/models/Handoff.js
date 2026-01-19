const mongoose = require('mongoose');

const handoffSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  shift: {
    type: String,
    enum: ['day', 'night'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // SBAR Format
  situation: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  assessment: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  // Additional Details
  vitals: {
    bloodPressure: Number,
    heartRate: Number,
    temperature: Number,
    oxygenSaturation: Number,
    respiratoryRate: Number
  },
  medicationsDue: [{
    medication: String,
    time: String,
    route: String
  }],
  pendingTasks: [{
    task: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent']
    }
  }],
  urgentFlags: [{
    type: String
  }],
  familyConcerns: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Handoff', handoffSchema);