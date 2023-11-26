const { Client, GatewayIntentBits } = require('discord.js');
const { prefix, token } = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'submitloa') {
    submitLOA(message.author.id, args);
    message.reply('LOA submitted successfully!');
  } else if (command === 'extendloa' && message.member.roles.cache.some(role => role.name === 'LOA Tracker')) {
    extendLOA(message.mentions.users.first(), args);
    message.reply('LOA extended successfully!');
  } else if (command === 'submitin') {
    submitIN(message.author.id, args);
    message.reply('IN submitted successfully!');
  }
});

function loadData() {
  try {
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return {};
  }
}

function saveData(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('data.json', jsonData, 'utf8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

function submitLOA(userId, args) {
  const data = loadData();
  data[userId] = { type: 'LOA', startDate: args[0], endDate: args[1] };
  saveData(data);
}

function extendLOA(user, args) {
  const data = loadData();
  const userId = user.id;
  if (data[userId] && data[userId].type === 'LOA') {
    data[userId].endDate = args[0];
    saveData(data);
  }
}

function submitIN(userId, args) {
  const data = loadData();
  data[userId] = { type: 'IN', startDate: args[0], endDate: args[1] };
  saveData(data);
}

client.login(token);
