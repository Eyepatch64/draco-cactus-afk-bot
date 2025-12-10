const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('✅ DracoSMP AFK Bot: cactusfarmer is grinding 24/7!'));
app.listen(port, () => console.log(`🌐 Web on ${port}`));

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'play.dracosmp.fun',
    port: 25565,
    username: 'cactusfarmer',
    version: '1.21.1',
    auth: 'offline'
  });

  bot.on('login', () => console.log('🔑 Logged in as cactusfarmer'));
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

  // 🛡️ Anti-AFK: Looks, jumps, tiny walks
  setInterval(() => {
    if (bot) {
      bot.look(bot.entity.yaw + (Math.random()-0.5)*0.5, bot.entity.pitch + (Math.random()-0.5)*0.5);
      if (Math.random() < 0.2) bot.jump();
      if (Math.random() < 0.1) {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 200);
      }
    }
  }, 15000);

  bot.on('chat', (u, m) => u !== bot.username && console.log(`💬 \( {u}: \){m}`));
  bot.on('end', (reason) => {
    console.log(`❌ DC: ${reason} | Reconnect in 5s...`);
    setTimeout(createBot, 5000);
  });
  bot.on('error', err => {
    console.log('❌ Error:', err);
    setTimeout(createBot, 5000);
  });
}

createBot();
