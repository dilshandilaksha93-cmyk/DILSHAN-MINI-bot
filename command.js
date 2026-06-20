const axios = require('axios');
const { BOT_NAME } = require('../config');

const sendMessage = async (phone_number_id, access_token, to, text) => {
  await axios.post(
    `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
    {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    },
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    }
  );
};

exports.handleCommand = async (from, text, phone_number_id, access_token) => {
  const command = text.toLowerCase().trim();

  if (command === '!menu' || command === '!help') {
    const menu = `╭─── ${BOT_NAME} MENU ───╮
│
│!ping - Check bot speed ⚡
│!alive - Bot status ✅
│!menu - Show menu 📋
│!help - Help guide ❓
│
╰─────────────────╯
Bot: ${BOT_NAME}
Owner: DILSHAN`;
    await sendMessage(phone_number_id, access_token, from, menu);
  }
  else if (command === '!alive') {
    await sendMessage(phone_number_id, access_token, from,
      `✅ ${BOT_NAME} is online!\nUptime: ${Math.floor(process.uptime())}s`
    );
  }
  else if (command === '!ping') {
    const start = Date.now();
    await sendMessage(phone_number_id, access_token, from,
      `Pong! ${BOT_NAME} speed: ${Date.now() - start}ms`
    );
  }
};
