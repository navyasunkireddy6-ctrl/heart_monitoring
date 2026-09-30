const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'CardioFusion AI',
    message: 'Backend is running successfully.'
  });
});

app.get('/api/dashboard', (req, res) => {
  const base = {
    ecgHeartRate: 76,
    ppgPulseRate: 75,
    ppgQuality: 94,
    trend: 'Stable'
  };

  const tick = Date.now() / 1000;
  const drift = Math.sin(tick / 4) * 4;

  res.json({
    status: 'ok',
    metrics: {
      ecgHeartRate: Math.round(base.ecgHeartRate + drift),
      ppgPulseRate: Math.round(base.ppgPulseRate + drift * 0.8),
      ppgQuality: Math.min(99, Math.max(90, Math.round(base.ppgQuality + Math.sin(tick / 6) * 2))),
      trend: Math.abs(drift) < 1.5 ? 'Stable' : 'Drifting'
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, email and message are required.'
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'Message received successfully.',
    payload: {
      name,
      email,
      message: message.trim()
    }
  });
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CardioFusion AI backend running at http://localhost:${PORT}`);
});
