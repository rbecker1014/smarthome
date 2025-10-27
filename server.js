const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SMARTTHINGS_PAT = process.env.SMARTTHINGS_PAT;

if (!SMARTTHINGS_PAT) {
  console.error('SMARTTHINGS_PAT is not set. Please add it to your .env file.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SMARTTHINGS_BASE_URL = 'https://api.smartthings.com/v1';

async function sendCommand(deviceId, payload) {
  try {
    const response = await axios.post(
      `${SMARTTHINGS_BASE_URL}/devices/${deviceId}/commands`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${SMARTTHINGS_PAT}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Failed to communicate with SmartThings API' };
    const err = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    err.status = status;
    throw err;
  }
}

app.post('/api/devices/:id/on', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await sendCommand(id, {
      commands: [
        {
          component: 'main',
          capability: 'switch',
          command: 'on',
        },
      ],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

app.post('/api/devices/:id/off', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await sendCommand(id, {
      commands: [
        {
          component: 'main',
          capability: 'switch',
          command: 'off',
        },
      ],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

app.post('/api/devices/:id/level', async (req, res) => {
  const { id } = req.params;
  const { level } = req.body;

  if (typeof level !== 'number' || Number.isNaN(level)) {
    return res.status(400).json({ success: false, message: 'Level must be a number between 0 and 100.' });
  }

  const boundedLevel = Math.max(0, Math.min(100, Math.round(level)));

  try {
    const data = await sendCommand(id, {
      commands: [
        {
          component: 'main',
          capability: 'switchLevel',
          command: 'setLevel',
          arguments: [boundedLevel],
        },
      ],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
