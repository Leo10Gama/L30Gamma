// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const proper = require('./commands/properCase');
const speak = require('./commands/speak');
const cat = require('./commands/cat');
const pigLatin = require('./commands/pigLatin');
const chem = require('./commands/chemistry');
const myMath = require('./commands/myMath');
const sum = require('./commands/sum');
const fibonacci = require('./commands/fibonacci');
const palindrome = require('./commands/palindrome');
const weather = require('weather-js');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

module.exports.run = async (client, message, args) => { }

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //Send wakeup message to specified channels
  // client.channels.cache.get('694692219562754108').send("Nyaa~ waking up from a quick cat nap");

  //This is the wakeup message for my personal server so I can test
  client.channels.cache.get('694662666190323812').send("Nyaa~ waking up from a quick cat nap");
});


//Create global constants
const commandList = ["cat", "fibonacci", "help", "math", "molarmass", "palindrome", "piglatin", "pokemon", "speak", "sum", "weather"];
const commandHelp = [
  "I'll show you a picture of a cat! You can follow up the command with either 'list' or the name of the cat you wanna see!",
  "I'll tell you the nth term of the fibonacci sequence",
  "Well, I'm sure you know what this command does since you called it just now, huh",
  "Do a basic math operation! Right now, I can only handle single expressons (i.e. 4 + 6)",
  "Find the molar mass of a chemical compound! Please be sure to enter with proper capital characters and no charges!!",
  "Enter a word and see if it's a palindrome! (spelt the same forwards and backwards)",
  "Convert a sentence to pig latin",
  "Enter the name of a Pokemon and I'll give you information on that Pokemon! Follow up commands include: 'id', 'info'",
  "I can hold some really good conversation if you want to talk with me for a while",
  "Enter a list of numbers and I'll sum them up for you",
  "Enter a city and I'll let you know what the weather there is like right now"];

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
        if (commands == "") {
          var returnValue = "Here's a list of all the things I can do:\n";
          for (var i = 0; i < commandList.length; i++) {
            returnValue += "`" + commandList[i] + "`: " + commandHelp[i] + "\n";
          }
          msg.channel.send(returnValue);
        } else if (commandList.indexOf(commands > -1)) {
          msg.channel.send(commandHelp[commandList.indexOf(commands)]);
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
        var location = commands.slice(7);
        console.log("Beginning command...");
        weather.find({ search: location, degreeType: 'C' }, function (err, result) {
          console.log("Inside the command");
          if (err || result.length == 0) {
            msg.channel.send("Please enter a valid location");
            return;
          }
          //Get the current weather info
          var current = result[0].current;
          //Put the results in an embed so it looks prettier
          console.log("Creating embed...");
          const embed = new Discord.MessageEmbed()
            .setDescription("**" + current.skytext + "**")
            .setAuthor("Weather at " + current.observationpoint)
            .setThumbnail(current.imageUrl)
            .setColor("0099ff")
            .addFields(
              { name: "Temperature", value: current.temperature + "\xB0C", inline: true },
              { name: "Feels like", value: current.feelslike + "\xB0C", inline: true },
              { name: "Humidity", value: current.humidity + "%", inline: true },
              { name: "Winds", value: current.winddisplay, inline: true }
            )
            .setFooter("Local time: " + current.observationtime + " on " + current.date);
          console.log("Embed created");
          msg.channel.send({ embed });
          console.log("Message sent");
        })
        console.log("End of command");
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
            P.getPokemonByName(commandsArray[0])
              .then(function (pokemon) {
                //Get all the proper values of the pokemon
                var pkmnName = proper.properCase(pokemon.name);
                var pkmnId = pokemon.id;
                var pkmnHeight = pokemon.height / 10; //Height in metres
                var pkmnWeight = pokemon.weight / 10; //Weight in kilograms
                var pkmnImage = pokemon.sprites.front_default;
                //Pokemon's type(s) is an array with objects in reverse order
                var pkmnTypes = [];
                for (var i = 0; i < pokemon.types.length; i++) {
                  pkmnTypes[i] = proper.properCase(pokemon.types[i].type.name);
                }
                pkmnTypes = pkmnTypes.reverse().join("/");
                //Pokemon's abilit(y/ies) are also an array in reverse order than we'd like it
                var pkmnAbilities = [];
                var pkmnHiddenAbility = "None";
                for (var i = 0; i < pokemon.abilities.length; i++) {
                  if (!pokemon.abilities[i].is_hidden) {
                    pkmnAbilities[i] = proper.properCase(pokemon.abilities[i].ability.name);
                  } else {
                    pkmnHiddenAbility = proper.properCase(pokemon.abilities[i].ability.name);
                  }
                }
                pkmnAbilities = pkmnAbilities.filter(function (i) {
                  return i != null;
                });
                pkmnAbilities = pkmnAbilities.join("/");
                //To access the genus of the pokemon we must use another command in the pokeapi
                var pkmnGenus;
                P.getPokemonSpeciesByName(commandsArray[0])
                  .then(function (pokemonSpecies) {
                    pkmnGenus = pokemonSpecies.genera[2].genus; //Index 2 of the genera array is the english translation
                    //Now we must format all the information correctly in an embed to send
                    const embed = new Discord.MessageEmbed()
                      .setTitle(pkmnName)
                      .setAuthor("Pokemon #" + pkmnId)
                      .setDescription(pkmnGenus)
                      .setThumbnail(pkmnImage)
                      .addFields(
                        { name: "Type", value: pkmnTypes, inline: true },
                        { name: "Height", value: pkmnHeight + " m", inline: true },
                        { name: "Weight", value: pkmnWeight + " kg", inline: true },
                        { name: "Abilities", value: pkmnAbilities, inline: true },
                        { name: "Hidden Ability", value: pkmnHiddenAbility, inline: true }
                      );
                    msg.channel.send(embed);
                  })
                  .catch(function (error) {
                    msg.channel.send('There was an ERROR', error);
                  });
              })
              .catch(function (error) {
                msg.channel.send('Invalid entry. Maybe you misspelt something?', error);
              });
            break;
          //We just want to retrieve the pokemon's dex number
          case (commandsArray[1] == "id"):
            P.getPokemonSpeciesByName(commandsArray[0])
              .then(function (pokemon) {
                var response = "";
                for (var i = pokemon.pokedex_numbers.length - 1; i > 0; i--) {
                  response += 'In the `' + pokemon.pokedex_numbers[i].pokedex.name + '` pokedex, ' + proper.properCase(pokemon.name) + ' is #`' + pokemon.pokedex_numbers[i].entry_number + '`\n';
                }
                msg.channel.send(response);
              })
              .catch(function (error) {
                msg.channel.send('Invalid entry. Maybe you misspelt something?', error);
              });
            break;
          //Get some delicious, delicious flavour text (mmmm delicious)
          /*Let it be known that this didnt compile the first time because the API spells it "flavor" and not "flavour"
          * Truly a lesson in regional implementation */
          case (commandsArray[1] == "info"):
            P.getPokemonSpeciesByName(commandsArray[0])
              .then(function (pokemon) {
                var flavorText = [];
                var j = 0;
                for (var i = 0; i < pokemon.flavor_text_entries.length; i++) {
                  //Only keep track of the entries that are english
                  //Maybe in the future add additional command for other languages?
                  if (pokemon.flavor_text_entries[i].language.name == 'en') {
                    flavorText[j] = "```" + pokemon.flavor_text_entries[i].flavor_text + "\n~ PKMN " + proper.properCase(pokemon.flavor_text_entries[i].version.name + "```");
                    j++;
                  }
                }
                msg.channel.send(flavorText[Math.floor(Math.random() * flavorText.length)]);
              })
              .catch(function (error) {
                msg.channel.send('Invalid entry. Maybe you misspelt something?', error);
              });
            break;
        }
        break;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);