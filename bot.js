// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const weather = require('weather-js');

module.exports.run = async(client, message, args) => {}

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
const maths = ["+","-","*","/","%","^"];
const atomPattern = /[A-Z][a-z]{0,2}\d*/g;
const bracketPattern = /\(.*?\)\d/g;
const atomicMasses = new Map([["H", 1.00797], ["He", 4.00260], ["Li", 6.941], ["Be", 9.01218], ["B", 10.81], ["C", 12.011], ["N", 14.0067], ["O", 15.9994], 
["F", 18.998403], ["Ne", 20.179], ["Na", 22.98977], ["Mg", 24.305], ["Al", 26.98154], ["Si", 28.0855], ["P", 30.97376], ["S", 32.06], ["Cl", 35.453], 
["Ar", 39.948], ["K", 39.0983], ["Ca", 40.08], ["Sc", 44.9559], ["Ti", 47.90], ["V", 50.9415], ["Cr", 51.996], ["Mn", 54.9380], ["Fe", 55.847], ["Ni", 58.70],
["Co", 58.9332], ["Cu", 63.546], ["Zn", 65.38], ["Ga", 69.72], ["Ge", 72.59], ["As", 74.9216], ["Se", 78.96], ["Br", 79.904], ["Kr", 83.80], ["Rb", 85.4678],
["Sr", 87.62], ["Y", 88.9059], ["Zr", 91.22], ["Nb", 92.9064], ["Mo", 95.94], ["Tc", 98], ["Ru", 101.07], ["Rh", 102.9055], ["Pd", 106.4], ["Ag", 107.868],
["Cd", 112.41], ["In", 114.82], ["Sn", 118.69], ["Sb", 121.75], ["I", 126.9045], ["Te", 127.60], ["Xe", 131.30], ["Cs", 132.9054], ["Ba", 137.33], 
["La", 138.9055], ["Ce", 140.12], ["Pr", 140.9077], ["Nd", 144.24], ["Pm", 145], ["Sm", 150.4], ["Eu", 151.96], ["Gd", 157.25], ["Tb", 158.9254], 
["Dy", 162.50], ["Ho", 164.9304], ["Er", 167.26], ["Tm", 168.9342], ["Yb", 173.04], ["Lu", 174.967], ["Hf", 178.49], ["Ta", 180.9479], ["W", 183.85], 
["Re", 186.207], ["Os", 190.2], ["Ir", 192.22], ["Pt", 195.09], ["Au", 196.9665], ["Hg", 200.59], ["Tl", 204.37], ["Pb", 207.2], ["Bi", 208.9804], 
["Po", 209], ["At", 210], ["Rn", 222], ["Fr", 223], ["Ra", 226.0254], ["Ac", 227.0278], ["Pa", 231.0359], ["Th", 232.0381], ["Np", 237.0482],
["U", 238.029], ["Pu", 242], ["Am", 243], ["Bk", 247], ["Cm", 247], ["Cf", 251], ["Es", 252], ["Mt", 278], ["Fm", 257], ["Md", 258],
["No", 259], ["Lr", 266], ["Rf", 267], ["Db", 268], ["Sg", 269], ["Bh", 270], ["Hs", 269], ["Ds", 281], ["Rg", 282], ["Cn", 285], ["Nh", 286], ["Fl", 289],
["Mc", 290], ["Lv", 293], ["Ts", 294], ["Og", 294]]);
const PHI = (1 + Math.sqrt(5)) / 2;
const PSI = -Math.pow(PHI, -1);
const commandList = ["cat", "fibonacci", "help", "math", "molarmass", "palindrome", "piglatin", "speak", "sum", "weather"];
const commandHelp = [
"I'll show you a picture of a cat! You can follow up the command with either 'list' or the name of the cat you wanna see!",
"I'll tell you the nth term of the fibonacci sequence",
"Well, I'm sure you know what this command does since you called it just now, huh",
"Do a basic math operation! Right now, I can only handle single expressons (i.e. 4 + 6)",
"Find the molar mass of a chemical compound! Please be sure to enter with proper capital characters and no charges!!",
"Enter a word and see if it's a palindrome! (spelt the same forwards and backwards)",
"Convert a sentence to pig latin",
"I can hold some really good conversation if you want to talk with me for a while",
"Enter a list of numbers and I'll sum them up for you",
"Enter a city and I'll let you know what the weather there is like right now"];

//Bot commands to listen for messages
client.on('message', async msg => {
  //Bot prefix (g. or G.)
    if (msg.content.substr(0,2) === 'g.' || msg.content.substr(0,2) === 'G.') {
      //Remove whitespace, all lowercase
      var commands = (msg.content.slice(2));

      //Check which command wants to be run
      switch(true) {
        
        //Ping command
        case (commands.substr(0,4).toLowerCase() == "ping"):
          msg.channel.send('Pong!');
          break;
        
        //Cat command
        case (commands.substr(0,3).toLowerCase() == "cat"):
          //Ok we know we're doing the cat command so format to check for the next command
          commands = commands.slice(4);
          //Check if a certain cat is wanted
          switch(true) {
            //List the kitties
            case (commands.substr(0,4).toLowerCase() == "list"):
              var returnValue = "Current list of cats:\n";
              for(var i=0; i<cats.length; i++) {
                returnValue += (cats[i].charAt(0).toUpperCase() + cats[i].slice(1) + "\n");
              }
              msg.channel.send(returnValue);
              break;
            //I want to see a specific kitty!
            case (cats.indexOf(commands.trim()) > -1):
              var cat2send = cats.indexOf(commands.trim());
              msg.channel.send("cat index: " + cat2send);
              msg.channel.send("Presenting... " + cats[cat2send].charAt(0).toUpperCase() + cats[cat2send].slice(1) + "!",
                {files: ["./cats/" + cats[cat2send] + "/" + Math.floor(Math.random() * catsLength[cat2send]) + ".jpg"]});
              break;
            //Generate random cat from current list
            default:
              var cat2send = Math.floor(Math.random() * cats.length);
              msg.channel.send("Presenting... " + cats[cat2send].charAt(0).toUpperCase() + cats[cat2send].slice(1) + "!",
                {files: ["./cats/" + cats[cat2send] + "/" + Math.floor(Math.random() * catsLength[cat2send]) + ".jpg"]});
              break;
          }
          break;

        //Speak command
        case (commands.substr(0,5).toLowerCase() == "speak"):
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
        case (commands.substr(0,4).toLowerCase() == "help"):
          commands = commands.slice(4).trim().toLowerCase();
          if(commands == "") {
            var returnValue = "Here's a list of all the things I can do:\n";
            for(var i=0; i<commandList.length; i++) {
              returnValue += "`" + commandList[i] + "`: " + commandHelp[i] + "\n";
            }
            msg.channel.send(returnValue);
          } else if(commandList.indexOf(commands > -1)) {
            msg.channel.send(commandHelp[commandList.indexOf(commands)]);
          }
          break;

        //Pig Latin command
        case (commands.substr(0,8).toLowerCase() == "piglatin"):
          //Get only the rest of the sentence
          commands = commands.slice(9);
          var phrase = commands.split(' ');
          var returnValue = "";
          for(var i=0; i<phrase.length; i++) {
            returnValue += pigLatin(phrase[i]) + " ";
          }
          msg.channel.send(returnValue);
          break;
          
        //Math command
        case (commands.substr(0,4).toLowerCase() == "math"):
          //Shorten message to mathematic expression
          var expression = commands.slice(5).trim();
          //Figure out what operation we're doing
          var operation;
          var nums;
          for(var i=0; i<expression.length; i++) {
            if(maths.indexOf(expression.charAt(i)) > -1) {
              operation = expression.charAt(i);
              nums = expression.split(expression.charAt(i));
            }
          }
          try {
            if(nums.length == 2) {
              switch(operation) {
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
          } catch(error) {
            msg.channel.send("Enter an expression after g.math to use the function properly!!");
          }
          break;

        //Molar Mass command
        case (commands.substr(0,9).toLowerCase() == "molarmass"):
          try {
            if (commands.slice(9).trim() != "") {
              var inBrackets = commands.match(bracketPattern);
              var compound = commands.slice(9).replace(bracketPattern, "");
              var bracketsFormatted = inBrackets != null ? bracketFormat(inBrackets) : null;
              var atoms = compound.match(atomPattern).concat(bracketsFormatted);
              //Remove potential blank elements from array
              atoms = atoms.filter(function (i) {
                return i != null;
              });
              //"atoms" is a string array containing a chemical symbol (H, Na, etc.), and potentially an integer
              var totalMass = 0;
              for(var i=0; i<atoms.length; i++) {
                totalMass += atomMass(atoms[i]);
              }
              msg.channel.send(totalMass.toFixed(2) + " g/mol");
            } else {
              msg.channel.send("To use this command, enter a chemical compound! Remember that molecular formulas are case sensitive!!");
            }
          } catch(error) {
            msg.channel.send("Couldn't complete operation. Are you sure that's a valid chemical formula?");
          }
          break;

        //Palindrome command
        case (commands.substr(0,10).toLowerCase() == "palindrome"):
          var word = commands.slice(10).toLowerCase().trim();
          msg.channel.send(isPalindrome(word) ? "This **is** a palindrome" : "This **is not** a palindrome");
          break;

        //Weather command
        case(commands.substr(0,7).toLowerCase() == "weather"):
          var location = commands.slice(7);
          weather.find({search: location, degreeType: 'C'}, function(err, result) {
            if(err) msg.channel.send("Something went wrong");
            if(result.length == 0) {
              msg.channel.send("Please enter a valid location");
              return;
            }
            //Get the current weather info
            var current = result[0].current;
            //Put the results in an embed so it looks prettier
            const embed = new Discord.MessageEmbed()
              .setDescription("**"+current.skytext+"**")
              .setAuthor("Weather at "+current.observationpoint)
              .setThumbnail(current.imageUrl)
              .setColor("0099ff")
              .addFields(
                {name: "Temperature", value: current.temperature + "\xB0C", inline: true},
                {name: "Feels like", value: current.feelslike + "\xB0C", inline: true},
                {name: "Humidity", value: current.humidity + "%", inline: true},
                {name: "Winds", value: current.winddisplay, inline: true}
              )
              .setFooter("Local time: " + current.observationtime + " on " + current.date);
            msg.channel.send({embed});
          })
          break;

        //Sum command
        case(commands.substr(0,3).toLowerCase() == "sum"):
          var things2sum = commands.slice(3).split(" ");
          msg.channel.send("The sum is " + sumThing(things2sum.map(Number)));
          break;

        //Fibonacci command
        case(commands.substr(0,9).toLowerCase() == "fibonacci"):
          var n = parseInt(commands.slice(9).trim());
          try {
            msg.channel.send(fibonacci(n));
          } catch(err) {
            msg.channel.send("Please follow up the command with an integer!!");
          }
          break;
      }        
    }
});

client.login(process.env.DISCORD_TOKEN);


//Pig Latin command function
function pigLatin(word) {
  var i = 0;
  while(i != word.length) {
    if(['a','e','i','o','u','A','E','I','O','U'].indexOf(word.charAt(i)) > -1) {
      //There is a vowel at this position
      if(i == 0) {
        //Word starts with vowel
        if([',','.','?','!'].indexOf(word.charAt(word.length-1)) > -1) {
          return (word.substr(0, word.length-1) + "yay" + word.slice(word.length-1)).toLowerCase();
        } else {
          return (word + "yay").toLowerCase();
        }
      } else {
        //Word does not start with vowel
        if([',','.','?','!'].indexOf(word.charAt(word.length-1)) > -1) {
          return (word.slice(i, word.length-1) + word.substr(0,i) + "ay" + word.slice(word.length-1)).toLowerCase();
        } else {
          return (word.slice(i) + word.substr(0,i) + "ay").toLowerCase();
        }
      }
    } else {
      i++;
    }
  }
  //Word has no vowels
  if([',','.','?','!'].indexOf(word.charAt(word.length-1)) > -1) {
    return (word.s + "yay").toLowerCase();
  } else {
    return (word + "yay").toLowerCase();
  }
}


//For molar mass command
//Multiply the compounds inside any brackets by their respective amounts
function bracketFormat(inBrackets) {
  var atoms = [];
  for(var i=0; i<inBrackets.length; i++) {
    //Find out what to multiply all things by
    var multipleUnformatted = inBrackets[i].match(/\)+?\d/i);
    var multiple = parseInt(multipleUnformatted[0].slice(1));
    //Get the individual atoms
    var atomsTemp = inBrackets[i].match(atomPattern);
    //Handle the situation that the atom is already being multiplied by something (i.e. the H4 in NH4)
    for(var j=0; j<atomsTemp.length; j++) {
      var endNumUnformatted = atomsTemp[j].match(/\d/);
      var endNum = (endNumUnformatted != null ? parseInt(endNumUnformatted[0]) : 1);
      atomsTemp[j] = atomsTemp[j].match(/[a-zA-z]/) + parseInt(multiple * endNum);
      atoms.push(atomsTemp[j]);
    }
  }
  return atoms;
}

//Calculate the mass of atoms
//Pre: a string is passed consisting of 1-3 letters and any amount of numbers; Post: an integer is returned
function atomMass(atom) {
  var key = atom.match(/[a-zA-Z]*/);
  var temp = atom.match(/\d+/);
  var n = (temp != null ? parseInt(temp[0]) : 1);
  return parseFloat(atomicMasses.get(key[0]) * parseInt(n));
}


//For palindrome
//Pre: A string is passed and checked if the reverse is the same as the forward
function isPalindrome(word) {
  var returnValue = true;
  for(var i=0; i<word.length/2; i++) {
    if(word.charAt(i) != word.charAt(word.length - 1 - i)) {
      returnValue = false;
    }
  }
  return returnValue;
}


//For sum command
//Pre: take an array and sum the numerical values inside of it
function sumThing(items) {
  var total = 0;
  for(var i=0; i<items.length; i++) {
    if(!isNaN(items[i])) {
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
  if(n<=70) {
    return Math.round((Math.pow(PHI, n) - Math.pow(PSI, n)) / Math.sqrt(5)) ;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}