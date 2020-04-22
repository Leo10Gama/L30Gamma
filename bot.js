// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const chem = require('./chemistry');
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
const cats = ["ollie", "mushu", "achilles", "luna", "winter"];
const catsLength = [23, 8, 5, 8, 6];
const maths = ["+", "-", "*", "/", "%", "^"];
const PHI = (1 + Math.sqrt(5)) / 2;
const PSI = -Math.pow(PHI, -1);
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
        commands = commands.slice(4);
        //Check if a certain cat is wanted
        switch (true) {
          //List the kitties
          case (commands.substr(0, 4).toLowerCase() == "list"):
            var returnValue = "Current list of cats:\n";
            for (var i = 0; i < cats.length; i++) {
              returnValue += (properCase(cats[i]) + "\n");
            }
            msg.channel.send(returnValue);
            break;
          //I want to see a specific kitty!
          case (cats.indexOf(commands.trim()) > -1):
            var cat2send = cats.indexOf(commands.trim());
            msg.channel.send("Presenting... " + properCase(cats[cat2send]) + "!",
              { files: ["./cats/" + cats[cat2send] + "/" + Math.floor(Math.random() * catsLength[cat2send]) + ".jpg"] });
            break;
          //Generate random cat from current list
          default:
            var cat2send = Math.floor(Math.random() * cats.length);
            msg.channel.send("Presenting... " + properCase(cats[cat2send]) + "!",
              { files: ["./cats/" + cats[cat2send] + "/" + Math.floor(Math.random() * catsLength[cat2send]) + ".jpg"] });
            break;
        }
        break;

      //Speak command
      case (commands.substr(0, 5).toLowerCase() == "speak"):
        var x = Math.floor(Math.random() * 100);
        switch (true) {
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
        //Get only the rest of the sentence
        commands = commands.slice(9);
        var phrase = commands.split(' ');
        var returnValue = "";
        for (var i = 0; i < phrase.length; i++) {
          returnValue += pigLatin(phrase[i]) + " ";
        }
        msg.channel.send(returnValue);
        break;

      //Math command
      case (commands.substr(0, 4).toLowerCase() == "math"):
        //Shorten message to mathematic expression
        var expression = commands.slice(5).trim();
        //Figure out what operation we're doing
        var operation;
        var nums;
        for (var i = 0; i < expression.length; i++) {
          if (maths.indexOf(expression.charAt(i)) > -1) {
            operation = expression.charAt(i);
            nums = expression.split(expression.charAt(i));
          }
        }
        try {
          if (nums.length == 2) {
            switch (operation) {
              case maths[0]:
                msg.channel.send(parseInt(nums[0]) + parseInt(nums[1]));
                break;
              case maths[1]:
                msg.channel.send(parseInt(nums[0]) - parseInt(nums[1]));
                break;
              case maths[2]:
                msg.channel.send(parseInt(nums[0]) * parseInt(nums[1]));
                break;
              case maths[3]:
                msg.channel.send(parseInt(nums[0]) / parseInt(nums[1]));
                break;
              case maths[4]:
                msg.channel.send(parseInt(nums[0]) % parseInt(nums[1]));
                break;
              case maths[5]:
                msg.channel.send(Math.pow(parseInt(nums[0]), parseInt(nums[1])));
                break;
              default:
                msg.channel.send("Whoopsies, something happened that shouldn't've happened...");
                break;
            }
          }
        } catch (error) {
          msg.channel.send("Enter an expression after g.math to use the function properly!!");
        }
        break;

      //Molar Mass command
      case (commands.substr(0, 9).toLowerCase() == "molarmass"):
        msg.channel.send(chem.molarMass(commands.slice(9).trim()));
        break;

      //Palindrome command
      case (commands.substr(0, 10).toLowerCase() == "palindrome"):
        var word = commands.slice(10).toLowerCase().trim();
        msg.channel.send(isPalindrome(word) ? "This **is** a palindrome" : "This **is not** a palindrome");
        break;

      //Weather command
      case (commands.substr(0, 7).toLowerCase() == "weather"):
        var location = commands.slice(7);
        weather.find({ search: location, degreeType: 'C' }, function (err, result) {
          if (err) msg.channel.send("Something went wrong");
          if (result.length == 0) {
            msg.channel.send("Please enter a valid location");
            return;
          }
          //Get the current weather info
          var current = result[0].current;
          //Put the results in an embed so it looks prettier
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
          msg.channel.send({ embed });
        })
        break;

      //Sum command
      case (commands.substr(0, 3).toLowerCase() == "sum"):
        var things2sum = commands.slice(3).split(" ");
        msg.channel.send("The sum is " + sumThing(things2sum.map(Number)));
        break;

      //Fibonacci command
      case (commands.substr(0, 9).toLowerCase() == "fibonacci"):
        var n = parseInt(commands.slice(9).trim());
        try {
          msg.channel.send(fibonacci(n));
        } catch (err) {
          msg.channel.send("Please follow up the command with an integer!!");
        }
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
                var pkmnName = properCase(pokemon.name);
                var pkmnId = pokemon.id;
                var pkmnHeight = pokemon.height / 10; //Height in metres
                var pkmnWeight = pokemon.weight / 10; //Weight in kilograms
                var pkmnImage = pokemon.sprites.front_default;
                //Pokemon's type(s) is an array with objects in reverse order
                var pkmnTypes = [];
                for (var i = 0; i < pokemon.types.length; i++) {
                  pkmnTypes[i] = properCase(pokemon.types[i].type.name);
                }
                pkmnTypes = pkmnTypes.reverse().join("/");
                //Pokemon's abilit(y/ies) are also an array in reverse order than we'd like it
                var pkmnAbilities = [];
                var pkmnHiddenAbility = "None";
                for (var i = 0; i < pokemon.abilities.length; i++) {
                  if (!pokemon.abilities[i].is_hidden) {
                    pkmnAbilities[i] = properCase(pokemon.abilities[i].ability.name);
                  } else {
                    pkmnHiddenAbility = properCase(pokemon.abilities[i].ability.name);
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
                  response += 'In the `' + pokemon.pokedex_numbers[i].pokedex.name + '` pokedex, ' + properCase(pokemon.name) + ' is #`' + pokemon.pokedex_numbers[i].entry_number + '`\n';
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
                    flavorText[j] = "```" + pokemon.flavor_text_entries[i].flavor_text + "\n~ PKMN " + properCase(pokemon.flavor_text_entries[i].version.name + "```");
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


//Pig Latin command function
function pigLatin(word) {
  var i = 0;
  while (i != word.length) {
    if (['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].indexOf(word.charAt(i)) > -1) {
      //There is a vowel at this position
      if (i == 0) {
        //Word starts with vowel
        if ([',', '.', '?', '!'].indexOf(word.charAt(word.length - 1)) > -1) {
          return (word.substr(0, word.length - 1) + "yay" + word.slice(word.length - 1)).toLowerCase();
        } else {
          return (word + "yay").toLowerCase();
        }
      } else {
        //Word does not start with vowel
        if ([',', '.', '?', '!'].indexOf(word.charAt(word.length - 1)) > -1) {
          return (word.slice(i, word.length - 1) + word.substr(0, i) + "ay" + word.slice(word.length - 1)).toLowerCase();
        } else {
          return (word.slice(i) + word.substr(0, i) + "ay").toLowerCase();
        }
      }
    } else {
      i++;
    }
  }
  //Word has no vowels
  if ([',', '.', '?', '!'].indexOf(word.charAt(word.length - 1)) > -1) {
    return (word.s + "yay").toLowerCase();
  } else {
    return (word + "yay").toLowerCase();
  }
}

//For cats (and maybe future application?)
//Pre: A string in all lowercase; Post: Capitalize the first letter of that string
function properCase(word) {
  var thing2return = "";
  if (word.charAt(0) >= 'a' && word.charAt(0) <= 'z') {
    thing2return += word.charAt(0).toUpperCase();
    thing2return += word.slice(1);
  } else {
    thing2return = word;
  }
  return thing2return;
}


//For palindrome
//Pre: A string is passed and checked if the reverse is the same as the forward
function isPalindrome(word) {
  var returnValue = true;
  for (var i = 0; i < word.length / 2; i++) {
    if (word.charAt(i) != word.charAt(word.length - 1 - i)) {
      returnValue = false;
    }
  }
  return returnValue;
}


//For sum command
//Pre: take an array and sum the numerical values inside of it
function sumThing(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (!isNaN(items[i])) {
      total += items[i];
    }
  }
  return total;
}


//For fibonacci command
/*Normally, a fibonacci function would only return values for the first two terms of the sequence
* and call on itself recursively to arrive at an answer. However, using the mathematical formula 
* for the nth term is much faster. The only downside is its source of error, which occurs after 
* the 70th term. To work around this, we can employ the more traditional fibonacci method to handle 
* the larger cases, leading to a faster overall program*/
function fibonacci(n) {
  if (n <= 70) {
    return Math.round((Math.pow(PHI, n) - Math.pow(PSI, n)) / Math.sqrt(5));
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}