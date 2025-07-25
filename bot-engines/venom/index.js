const venom = require('venom-bot');
const botConfig = require('./config');

function startVenomBot() {
  venom
    .create({
      session: botConfig.sessionName,
      multidevice: true,
    })
    .then((client) => start(client))
    .catch((err) => {
      console.error('❌ Venom creation error:', err);
    });
}

function start(client) {
  console.log(`✅ ${botConfig.botName} is online.`);

  client.onMessage(async (message) => {
    if (message.body.toLowerCase() === 'hi') {
      await client.sendText(
        message.from,
        `👑 Hello, I am ${botConfig.botName}, created by Lord Rahl.`
      );
    }

    // Add more commands here
  });
}

module.exports = { startVenomBot };
