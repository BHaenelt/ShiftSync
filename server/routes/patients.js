const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// POST /api/patients - Create a new patient
router.post('/', async (req, res) => {
  try {
    const { 
      mrn, 
      firstName, 
      lastName, 
      dateOfBirth, 
      roomNumber, 
      admittingDiagnosis, 
      codeStatus, 
      allergies,
      attendingPhysician 
    } = req.body;

    // Create new patient
    const patient = new Patient({
      mrn,
      firstName,
      lastName,
      dateOfBirth,
      roomNumber,
      admittingDiagnosis,
      codeStatus,
      allergies,
      attendingPhysician
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/patients - Get all active patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .sort({ roomNumber: 1 }); // Sort by room number

    res.json({
      message: 'Patients retrieved successfully',
      count: patients.length,
      patients
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id - Get a single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Patient retrieved successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/patients/:id - Update a patient
router.put('/:id', async (req, res) => {
  try {
    const { 
      roomNumber, 
      admittingDiagnosis, 
      codeStatus, 
      allergies,
      attendingPhysician 
    } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        roomNumber,
        admittingDiagnosis,
        codeStatus,
        allergies,
        attendingPhysician
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Patient updated successfully',
      patient
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/patients/:id - Soft delete a patient (set isActive to false)
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      message: 'Patient deactivated successfully',
      patient
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;