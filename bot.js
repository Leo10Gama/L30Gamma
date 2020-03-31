// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//Create global variables
const cats = ["ollie", "mushu"];
const catsLength = [23, 8];
const commandList = ["cat", "help", "ping", "speak"];
const commandHelp = [
"I'll show you a picture of a cat! You can follow up the command with either 'list' or the name of the cat you wanna see!",
"Well, I'm sure you know what this command does since you called it just now, huh.",
"You say ping, I say pong. Simple as that.",
"I can hold some really good conversation if you want to talk with me for a while."];

//Bot commands to listen for messages
client.on('message', msg => {
  //Bot prefix (g. or G.)
    if (msg.content.substr(0,2) === 'g.' || msg.content.substr(0,2) === 'G.') {
      //Remove whitespace, all lowercase
      var commands = (msg.content.toLowerCase().replace(' ', '')).substr(2);

      //Check which command wants to be run
      switch(true) {
        
        //Ping command
        case (commands.substr(0,4) == "ping"):
          msg.channel.send('Pong!');
          break;
        
        //Cat command
        case (commands.substr(0,3) == "cat"):
          //Check if a certain cat is wanted
          switch(true) {
            //List the kitties
            case (commands.substr(3,4) == "list"):
              var returnValue = "Current list of cats:\n";
              for(var i=0; i<cats.length; i++) {
                returnValue += (cats[i].charAt(0).toUpperCase() + cats[i].slice(1) + "\n");
              }
              msg.channel.send(returnValue);
              break;
            //I want to see a specific kitty!
            case (commands.substr(3,5) == "ollie"):
              msg.channel.send("Presenting... Ollie!", {files: ["./cats/" + cats[0] + "/" + Math.floor(Math.random() * catsLength[0]) + ".jpg"]});
              break;
            case (commands.substr(3,5) == "mushu"):
              msg.channel.send("Presenting... Mushu!", {files: ["./cats/" + cats[1] + "/" + Math.floor(Math.random() * catsLength[1]) + ".jpg"]});
              break;
            //Show me any kitty
            default:
              var cat2send = Math.floor(Math.random() * cats.length);
              msg.channel.send("Presenting... " + cats[cat2send].charAt(0).toUpperCase() + cats[cat2send].slice(1) + "!",
                {files: ["./cats/" + cats[cat2send] + "/" + Math.floor(Math.random() * catsLength[cat2send]) + ".jpg"]});
              break;
          }
          break;

        //Speak command
        case (commands.substr(0,5) == "speak"):
          var x = Math.floor(Math.random() * 100);
          switch(true) {
            case (x <= 50):
              msg.channel.send("meow");
              break;
            case (x <= 70):
              msg.channel.send("*meow*");
              break;
            case (x <= 85):
              msg.channel.send("**meow**");
              break;
            case (x <= 95):
              msg.channel.send("__meow__");
              break;
            default:
              msg.channel.send("01101101 01100101 01101111 01110111");
              break;
            }
          break;

        //Help command
        case (commands.substr(0,4) == "help"):
          var returnValue = "Here's a list of all the things I can do:\n";
          for(var i=0; i<commandList.length; i++) {
            returnValue += "`" + commandList[i] + "`: " + commandHelp[i] + "\n";
          }
          msg.channel.send(returnValue);
        break;
      }        
    }
});

client.login(process.env.DISCORD_TOKEN);