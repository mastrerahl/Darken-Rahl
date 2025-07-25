const venom = require('venom-bot');
const { botName, sessionFolder, ownerNumber } = require('./config');
const fs = require('fs');

// Make sure session folder exists
if (!fs.existsSync(sessionFolder)) {
  fs.mkdirSync(sessionFolder, { recursive: true });
}

venom
  .create({
    session: botName,
    multidevice: true,
    headless: true,
    mkdirFolderToken: sessionFolder,
    disableWelcome: true,
  })
  .then((client) => start(client))
  .catch((e) => console.log('❌ Error:', e));

function start(client) {
  console.log(`✅ ${botName} is now running...`);

  client.onMessage(async (message) => {
    if (message.body.toLowerCase() === 'hi') {
      await client.sendText(
        message.from,
        `👑 Hello, I am ${botName}, created by Lord Rahl.`
      );
    }

    // Add more commands here
  });
}
