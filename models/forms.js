const mongoose = require('mongoose');

// Schema for the contact form submissions
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Schema for the service request form submissions
const ServiceRequestSchema = new mongoose.Schema({
  patient: { type: String, required: true, trim: true },
  pickup: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  details: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', ContactSchema);
const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

module.exports = {
  Contact,
  ServiceRequest,
};
