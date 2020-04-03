// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

module.exports.run = async(client, message, args) => {}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //Send wakeup message to specified channels
    // client.channels.cache.get('694692219562754108').send("Nyaa~ waking up from a quick cat nap");

    //This is the wakeup message for my personal server so I can test
    client.channels.cache.get('694662666190323812').send("Nyaa~ waking up from a quick cat nap");
});


//Create global variables
const cats = ["ollie", "mushu", "achilles", "luna", "winter"];
const catsLength = [23, 8, 5, 8, 6];
const maths = ["+","-","*","/","%","^"];
const deck = ["A♠","A♥","A♦","A♣","2♠","2♥","2♦","2♣","3♠","3♥","3♦","3♣","4♠","4♥","4♦","4♣","5♠","5♥","5♦","5♣","6♠","6♥","6♦","6♣","7♠","7♥","7♦","7♣",
"8♠","8♥","8♦","8♣","9♠","9♥","9♦","9♣","10♠","10♥","10♦","10♣","J♠","J♥","J♦","J♣","Q♠","Q♥","Q♦","Q♣","K♠","K♥","K♦","K♣"];
const commandList = ["cat", "help", "math", "piglatin", "speak"];
const commandHelp = [
"I'll show you a picture of a cat! You can follow up the command with either 'list' or the name of the cat you wanna see!",
"Well, I'm sure you know what this command does since you called it just now, huh",
"Do a basic math operation! Right now, I can only handle single expressons (i.e. 4 + 6)",
"Convert a sentence to pig latin",
"I can hold some really good conversation if you want to talk with me for a while"];

//Bot commands to listen for messages
client.on('message', async msg => {
  const filter = response => {return response.author.id === msg.author.id};
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
          var returnValue = "Here's a list of all the things I can do:\n";
          for(var i=0; i<commandList.length; i++) {
            returnValue += "`" + commandList[i] + "`: " + commandHelp[i] + "\n";
          }
          msg.channel.send(returnValue);
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

//Shuffle an array
function shuffle(a) {
  for (var i=a.length - 1; i>0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [a[i], a[j]] = [a[j], a[i]];
  }
}

//Count sum of points in hand
function handValue(hand) {
  //Map numeric values of the hand
  var cardVal = hand.map(function(card) {
    switch(card.charAt(0)) {
      case "A":
        return "A";
      case "1":
      case "J":
      case "Q":
      case "K":
        return "10";
      default:
        return card.charAt(0);
    }
  })
  //Sum the total *note that A will appear at the end due to sort function*
  cardVal.sort();
  var total = 0;
  for(var i=0; i<cardVal.length; i++) {
    if(cardVal[i] != "A") {
      total += parseInt(cardVal[i]);
    } else {
      if (total <= 10) {
        total += 11;
      } else {
        total += 1;
      }
    }
  }
  return total;
}

//List the cards in my hand
function listHand(hand) {
  var returnValue = "";
  for(var i=0; i<hand.length; i++) {
    returnValue += hand[i] + ", ";
  }
  return returnValue.substr(0,returnValue.length-2);
}