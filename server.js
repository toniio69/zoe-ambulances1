require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./route/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 MongoDB connected successfully.'))
.catch(err => {
  console.error('🔴 MongoDB connection error:', err);
  process.exit(1);
});

// API Routes
app.use('/api', apiRoutes);

// Admin Routes (for fetching data)
const { Contact, ServiceRequest } = require('./models/forms');

app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching contacts.' });
    }
});

app.get('/api/admin/requests', async (req, res) => {
    try {
        const requests = await ServiceRequest.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service requests.' });
    }
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚑 Zoe Ambulances backend is running on http://localhost:${PORT}`);
});
