// deploy.js

const { create } = require('venom-bot');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load Firebase credentials
const serviceAccount = require('./firebase-admin.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Firestore collection where deployment forms are saved
const botsRef = db.collection('bots');

// Track already deployed bots to avoid duplicates
const startedBots = new Set();

console.log('🟢 Waiting for bot deployments...');

// Listen for changes in the bots collection
botsRef.onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const botData = change.doc.data();
    const botId = change.doc.id;

    if (change.type === 'added' && !startedBots.has(botId)) {
      console.log(`🚀 Deploying new bot: ${botData.botName}`);

      // Mark this bot as started
      startedBots.add(botId);

      // Save session file (as venom needs it on disk)
      const sessionDir = path.join(__dirname, 'sessions', botId);
      fs.mkdirSync(sessionDir, { recursive: true });

      const sessionFile = path.join(sessionDir, `${botId}.json`);
      fs.writeFileSync(sessionFile, botData.session);

      // Start the bot with venom
      create({
        session: botId,
        multidevice: true,
        headless: true,
        disableWelcome: true,
        logQR: false,
        sessionPath: sessionDir,
      })
        .then((client) => startBot(client, botData))
        .catch((error) => console.error(`❌ Failed to start ${botData.botName}:`, error));
    }
  });
});

function startBot(client, botData) {
  console.log(`✅ Bot "${botData.botName}" is now running`);

  client.onMessage(async (message) => {
    if (message.body === `${botData.prefix}ping`) {
      await client.sendText(message.from, `🤖 Hello from *${botData.botName}*. A project by Lord Rahl.`);
    }

    if (message.body === `${botData.prefix}info`) {
      await client.sendText(
        message.from,
        `👑 This bot belongs to: *${botData.owner}*\n📛 Bot Name: *${botData.botName}*\n🧠 Engine: *Venom*\n🪪 Created by: *Lord Rahl*`
      );
    }

    // Add more commands here as needed
  });
              }
