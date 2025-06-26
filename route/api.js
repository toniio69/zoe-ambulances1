const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Contact, ServiceRequest } = require('../models/forms');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact - Handles contact form submissions
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create and save the new contact entry
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      subject: '📨 New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to process contact form.' });
  }
});

// POST /api/request - Handles service request form submissions
router.post('/request', async (req, res) => {
  try {
    const { patient, pickup, destination, contact, details } = req.body;

    // Create and save the new service request
    const newRequest = new ServiceRequest({ patient, pickup, destination, contact, details });
    await newRequest.save();

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      subject: '🚑 New Ambulance Service Request',
      text: `Patient: ${patient}\nPickup: ${pickup}\nDestination: ${destination}\nContact: ${contact}\nDetails: ${details || 'N/A'}`,
    });

    res.status(200).json({ message: 'Service request submitted successfully!' });
  } catch (error) {
    console.error('Service request error:', error);
    res.status(500).json({ message: 'Failed to process service request.' });
  }
});

module.exports = router;
