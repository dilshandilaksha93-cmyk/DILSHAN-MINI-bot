require('dotenv').config();
const express = require('express');
const { BOT_NAME } = require('./config');
const { handleCommand } = require('./commands/command');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (token === VERIFY_TOKEN) {
      console.log(`🚀 ${BOT_NAME} Webhook verified ✅`);
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && message.type === 'text') {
        const from = message.from;
        const text = message.text.body;
        const phone_number_id = changes.value.metadata.phone_number_id;
        const access_token = process.env.PAGE_ACCESS_TOKEN;

        await handleCommand(from, text, phone_number_id, access_token);
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ${BOT_NAME} is running on port ${PORT}`);
});
