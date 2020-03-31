// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Bot commands to listen for messages
client.on('message', msg => {
  //Bot prefix (g. or G.)
    if (msg.content.substr(0,2) === 'g.' || msg.content.substr(0,2) === 'G.') {
      //Remove whitespace, all lowercase
      var commands = (msg.content.toLowerCase().replace(' ', '')).substr(2);

      //Ping command
      if (commands.substr(0,4) == "ping") {
        msg.channel.send('Pong!');
      }
    }
  });

client.login(process.env.DISCORD_TOKEN);