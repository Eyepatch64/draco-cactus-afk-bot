const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('✅ DracoSMP AFK Bot: cactusfarmer is grinding 24/7!'));
app.listen(port, () => console.log(`🌐 Web on ${port}`));

let bot;
let reconnectAttempts = 0;
const maxAttempts = 10; // Prevent spam

function createBot() {
  if (reconnectAttempts >= maxAttempts) {
    console.log('❌ Max reconnects hit. Stopping.');
    process.exit(1); // Crash gracefully if too many fails
  }
  reconnectAttempts++;
  console.log(`🔄 Creating bot (attempt ${reconnectAttempts})...`);

  bot = mineflayer.createBot({
    host: 'play.dracosmp.fun',
    port: 25565,
    username: 'cactusfarmer',
    version: '1.21.1',
    auth: 'offline',
    checkTimeoutInterval: 30 * 1000, // 30s timeout check
    hideErrors: false
  });

  bot.on('login', () => {
    console.log('🔑 Logged in as cactusfarmer');
    reconnectAttempts = 0; // Reset on success
  });

  bot.on('spawn', () => {
    console.log('👶 Spawned! Commands in 5s...');
    setTimeout(() => {
      bot.chat('/Login lagatop');
      console.log('📤 Sent /Login lagatop');
    }, 5000);
    setTimeout(() => {
      bot.chat('/Afk');
      console.log('📤 Sent /Afk');
    }, 10000);
  });

  // 🛡️ Enhanced Anti-AFK + Keepalive (responds to server pings)
  setInterval(() => {
    if (bot && bot.entity) {
      // Random look/jump/walk
      bot.look(bot.entity.yaw + (Math.random() - 0.5) * 0.5, bot.entity.pitch + (Math.random() - 0.5) * 0.5);
      if (Math.random() < 0.3) bot.jump();
      if (Math.random() < 0.15) {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 300);
      }
      // Manual keepalive if needed
      if (bot._client.writeKeepAlive) bot._client.writeKeepAlive();
    }
  }, 10000); // Every 10s for aggressive anti-timeout

  bot.on('chat', (u, m) => {
    if (u !== bot.username) console.log(`💬 \( {u}: \){m}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`🚫 Kicked: ${reason}`);
  });

  bot.on('end', (reason) => {
    console.log(`❌ DC: ${reason || 'Unknown'}. Reconnect in 10s...`);
    setTimeout(createBot, 10000); // Auto-retry
  });

  bot.on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
    if (err.message.includes('timeout') || err.message.includes('keepalive')) {
      console.log('🔧 Timeout detected—reconnecting faster...');
    }
    setTimeout(createBot, 5000);
  });
}

// Infinite bot loop: If bot dies, restart it (keeps Express alive)
setInterval(() => {
  if (!bot || !bot.entity) {
    console.log('⚠️ Bot dead—reviving...');
    createBot();
  }
}, 30000); // Check every 30s

createBot(); // Start first time
console.log('🚀 Draco AFK Bot started!');
