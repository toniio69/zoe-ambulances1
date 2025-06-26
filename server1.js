const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚑 Zoe Ambulances backend running on http://localhost:${PORT}`);
});

// server.js or index.js

app.get('/api/admin/contacts', async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

app.get('/api/admin/requests', async (req, res) => {
  const requests = await ServiceRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});
