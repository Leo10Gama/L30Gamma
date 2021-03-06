// Run dotenv
require('dotenv').config();

const BOT_USER_ID = "546043647297060864"; //The user ID of the bot, for use sometimes
const Discord = require('discord.js');
const client = new Discord.Client();
const help = require('./commands/help');
const proper = require('./commands/properCase');
const speak = require('./commands/speak');
const cat = require('./commands/cat');
const pigLatin = require('./commands/pigLatin');
const chem = require('./commands/chemistry');
const myMath = require('./commands/myMath');
const sum = require('./commands/sum');
const fibonacci = require('./commands/fibonacci');
const palindrome = require('./commands/palindrome');
const weather = require('./commands/myWeather');
const pokedex = require('./commands/pokemon');
const roman = require('./commands/romanNums');
const rng = require('./commands/rng');
const myCollect = require('./commands/myCollect');
const blackjack = require('./commands/blackjack');

module.exports.run = async (client, message, args) => { }

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //Send wakeup message to specified channels
  // client.channels.cache.get('694692219562754108').send("Nyaa~ waking up from a quick cat nap");

  //This is the wakeup message for my personal server so I can test
  client.channels.cache.get('694662666190323812').send("Nyaa~ waking up from a quick cat nap");
});

//Bot commands to listen for messages
client.on('message', async msg => {
  //Bot prefix (g. or G.)
  if (msg.content.substr(0, 2) === 'g.' || msg.content.substr(0, 2) === 'G.') {
    //Remove whitespace, all lowercase
    var commands = (msg.content.slice(2));

    //Check which command wants to be run
    switch (true) {

      //Ping command
      case (commands.substr(0, 4).toLowerCase() == "ping"):
        msg.channel.send('Pong!');
        break;

      //Cat command
      case (commands.substr(0, 3).toLowerCase() == "cat"):
        //Ok we know we're doing the cat command so format to check for the next command
        commands = commands.slice(4).toLowerCase().trim();
        //Check if a followup command has been entered
        switch (true) {
          //List the kitties
          case (commands.substr(0, 4).toLowerCase() == "list"):
            msg.channel.send(cat.listCats());
            break;
          //Send a kitty
          default:
            var cat2send = cat.hasCat(commands) ? cat.sendCat(commands) : cat.sendCat()
            msg.channel.send(cat2send[0], cat2send[1]);
            break;
        }
        break;

      //Speak command
      case (commands.substr(0, 5).toLowerCase() == "speak"):
        msg.channel.send(speak.speak());
        break;

      //Help command
      case (commands.substr(0, 4).toLowerCase() == "help"):
        commands = commands.slice(4).trim().toLowerCase();
        //Display all commands
        if (commands == "") {
          var returnValue = "Here's all the things I can do! If you'd like a more detailed explanation on how to use a specific command, type `g.help [command]`\n";
          for (var i of help) {
            returnValue += "`" + i.keyword + "`\n";
          }
          msg.channel.send(returnValue);
        } else {
          //Display the properties of a single command
          var searchTerm = commands;
          var flag = false;
          for (var i of help) {
            if (i.keyword == searchTerm) {
              msg.channel.send(i.description + "\nInputs:\n`" + i.input.join("`\n`") + "`");
              flag = true;
            }
          }
          if (!flag) msg.channel.send("Invalid command. Check the full list of my commands with `g.help`");
        }
        break;

      //Pig Latin command
      case (commands.substr(0, 8).toLowerCase() == "piglatin"):
        msg.channel.send(pigLatin.toPL(commands.slice(9).split(' ')));
        break;

      //Math command
      case (commands.substr(0, 4).toLowerCase() == "math"):
        //Shorten message to mathematic expression
        msg.channel.send(myMath.compute(commands.slice(5).trim()));
        break;

      //Molar Mass command
      case (commands.substr(0, 9).toLowerCase() == "molarmass"):
        msg.channel.send(chem.molarMass(commands.slice(9).trim()));
        break;

      //Palindrome command
      case (commands.substr(0, 10).toLowerCase() == "palindrome"):
        msg.channel.send(palindrome.isPalindrome(commands.slice(10).toLowerCase().trim()) ? "This **is** a palindrome" : "This **is not** a palindrome");
        break;

      //Weather command
      case (commands.substr(0, 7).toLowerCase() == "weather"):
        weather.getWeather(commands.slice(7).trim(), msg.channel);
        break;
      //Forecast command
      case (commands.substr(0, 8).toLowerCase() == "forecast"):
        weather.getForecast(commands.slice(8).trim(), msg.channel);
        break;

      //Sum command
      case (commands.substr(0, 3).toLowerCase() == "sum"):
        msg.channel.send("The sum is " + sum.sumThings((commands.slice(3).split(" ")).map(Number)));
        break;

      //Fibonacci command
      case (commands.substr(0, 9).toLowerCase() == "fibonacci"):
        msg.channel.send(fibonacci.nthTerm(parseInt(commands.slice(9).trim())));
        break;

      //Pokemon command
      case (commands.substr(0, 7).toLowerCase() == "pokemon"):
        var commandsArray = commands.slice(7).toLowerCase().trim().split(" ");
        switch (true) {
          //We just want general information about a given pokemon
          case (commandsArray.length == 1):
            pokedex.getDexEntry(commandsArray[0], msg.channel);
            break;
          //We just want to retrieve the pokemon's dex number
          case (commandsArray[1] == "id"):
            pokedex.getPokemonId(commandsArray[0], msg.channel);
            break;
          //Get some delicious, delicious flavour text (mmmm delicious)
          /*Let it be known that this didnt compile the first time because the API spells it "flavor" and not "flavour"
          * Truly a lesson in regional implementation */
          case (commandsArray[1] == "info" || commandsArray[1] + " " + commandsArray[2] == "flavor text" || commandsArray[1] + " " + commandsArray[2] == "flavour text"):
            pokedex.getFlavorText(commandsArray[0], msg.channel);
            break;
          //Get a list of the pokemon's forms
          case (commandsArray[1] == "forms"):
            pokedex.getForms(commandsArray[0], msg.channel);
            break;
          //Get the pokemon's stats
          case (commandsArray[1] == "stats"):
            pokedex.getStats(commandsArray[0], msg.channel);
            break;
          //Get the pokemon's height
          case (commandsArray[1] == "height"):
            pokedex.getHeight(commandsArray[0], msg.channel);
            break;
          //Get the pokemon's weight
          case (commandsArray[1] == "weight"):
            pokedex.getWeight(commandsArray[0], msg.channel);
            break;
          //Get the pokemon's type (or type effectiveness)
          case (commandsArray[1] == "type"):
            if (commandsArray[2] == "effectiveness") {
              pokedex.getEffectiveness(commandsArray[0], msg.channel);
            } else {
              pokedex.getType(commandsArray[0], msg.channel);
            }
            break;
          //Get the pokemon's egg group
          case (commandsArray[1] == "egg" && commandsArray[2] == "group"):
            pokedex.getEggGroup(commandsArray[0], msg.channel);
            break;
          //Determine if the pokemon can breed with another pokemon
          case (commandsArray[1] == "breed" && commandsArray.length >= 3):
            pokedex.canBreed(commandsArray[0], commandsArray[2], msg.channel);
            break;
        }
        break;
      //Roman Numeral Command
      case (commands.substr(0, 5).toLowerCase() == "roman"):
        msg.channel.send(isNaN(commands.slice(5).trim()) ? roman.toStandard(commands.slice(5).trim().toUpperCase()) : roman.toRoman(commands.slice(5).trim()));
        break;
      //RNG Numbers commands
      case (commands.substr(0, 3).toLowerCase() == "rng"):
        msg.channel.send(commands.slice(3).trim().substr(0, 4).toLowerCase() == "coin" ? rng.flipCoin() : commands.slice(3).trim().substr(0, 4).toLowerCase() == "dice" ? rng.rollDice(parseInt(commands.slice(3).trim().slice(4).trim())) : "Invalid command. Please enter either `coin` or `dice [integer]`");
        break;
      //Collect command (mostly going to be used for testing message collectors)
      case (commands.substr(0, 7).toLowerCase() == "collect"):
        isNaN(commands.slice(7).trim()) ? myCollect.collectWithSubstring(commands.slice(7).trim(), msg.channel) : myCollect.collectAmount(msg.author.id, parseInt(commands.slice(7).trim()), msg.channel);
        break;
      //Blackjack command
      case (commands.substr(0, 9).toLowerCase() == "blackjack"):
        blackjack.startGame(msg.author.id, msg.channel);
        break;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);