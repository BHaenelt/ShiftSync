const express = require('express');
const router = express.Router();
const Handoff = require('../models/Handoff');
const Patient = require('../models/Patient');

// POST - Create a new handoff
router.post('/', async (req, res) => {
  try {
    const {
      patient,
      shift,
      situation,
      background,
      assessment,
      recommendation,
      urgentFlags,
      vitals,
      medicationsDue,
      pendingTasks
    } = req.body;

    // Check if patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newHandoff = new Handoff({
      patient,
      shift,
      situation,
      background,
      assessment,
      recommendation,
      urgentFlags,
      vitals,
      medicationsDue,
      pendingTasks
    });

    await newHandoff.save();
    
    res.status(201).json({
      message: 'Handoff created successfully',
      handoff: newHandoff
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating handoff', error: error.message });
  }
});


// GET - Get all handoffs
router.get('/', async (req, res) => {
  try {
    const handoffs = await Handoff.find()
      .populate('patient', 'firstName lastName mrn roomNumber')
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      message: 'Handoffs retrieved successfully',
      count: handoffs.length,
      handoffs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving handoffs', error: error.message });
  }
});

// GET - Get handoffs for a specific patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const handoffs = await Handoff.find({ patient: req.params.patientId })
      .populate('patient', 'firstName lastName mrn roomNumber')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Patient handoffs retrieved successfully',
      count: handoffs.length,
      handoffs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving handoffs', error: error.message });
  }
});

// GET - Get a single handoff by ID
router.get('/:id', async (req, res) => {
  try {
    const handoff = await Handoff.findById(req.params.id)
      .populate('patient', 'firstName lastName mrn roomNumber codeStatus allergies');

    if (!handoff) {
      return res.status(404).json({ message: 'Handoff not found' });
    }

    res.json({
      message: 'Handoff retrieved successfully',
      handoff
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving handoff', error: error.message });
  }
});


module.exports = router;