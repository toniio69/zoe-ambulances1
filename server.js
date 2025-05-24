const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Create MongoDB Schemas
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const ServiceRequestSchema = new mongoose.Schema({
  patientName: String,
  pickupLocation: String,
  destination: String,
  contactNumber: String,
  details: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);
const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = new Contact({ name, email, message });
    await contact.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n`
    });

    res.status(200).json({ message: 'Contact form received and emailed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process contact form.' });
  }
});

// Service Request Form Endpoint
app.post('/api/service-request', async (req, res) => {
  const { patientName, pickupLocation, destination, contactNumber, details, requestedAt, PCRImage } = req.body;

  try {
    const serviceRequest = new ServiceRequest({ patientName, pickupLocation, destination, contactNumber, details, requestedAt, PCRImage,  });
    await serviceRequest.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Service Request Submission',
      text: `Patient Name: ${patientName}\nPickup Location: ${pickupLocation}\nDestination: ${destination}\nContact Number: ${contactNumber}\nDetails: ${details}`
    });

    res.status(200).json({ message: 'Service request received and emailed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to process service request form.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚑 Zoe Ambulances backend running at http://localhost:${PORT}`);
});

// Fetch all contact messages
app.get('/api/admin/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contacts.' });
    }
  });
  
  // Fetch all service requests
  app.get('/api/admin/requests', async (req, res) => {
    try {
      const requests = await ServiceRequest.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service requests.' });
    }
  });