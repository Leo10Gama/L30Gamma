//Create the deck of cards
const SUITS = ["\u2660", "\u2665", "\u2666", "\u2663"];     //In order from left to right: spade, heart, diamond, club
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var tempDeck = [];
for (var suitIndex of SUITS) {
    for (var valIndex of VALUES) {
        tempDeck.push({ suit: suitIndex, val: valIndex });
    }
}
const DECK = tempDeck;

/* Function starts the game of blackjack with one player
    Pre: playerID is the discord ID of the player that initiated the game, channel is the channel in which the game will take place
    Post: A game of blackjack is played, game may end depending on the inputs of the user*/
exports.startGame = function (playerID, channel) {
    var myDeck = shuffleDeck(DECK);     //Shuffle deck
    var playerHand = [myDeck[0], myDeck[1]];
    var botHand = [myDeck[2], myDeck[3]];
    var deckIndex = 4;
    var playerScore = calculateScore(playerHand);
    var botScore = calculateScore(botHand);
    var gameStatus = "playerTurn";
    //Create collector and filter
    const filter = m => m.author.id == playerID;
    const collector = channel.createMessageCollector(filter, { time: 60000 });
    channel.send("Let's get this show on the road!\nYour hand:\n" + showHand(playerHand) + "\nWhat would you like to do?\n`Hit` `Stand` `Cancel`");

    collector.on('collect', m => {
        m = m.content.trim().toLowerCase();
        switch (true) {
            case (m == "hit"):
                //Give player new card and recalculate score
                playerHand.push(myDeck[deckIndex]);
                deckIndex++;
                playerScore = calculateScore(playerHand);
                if(playerScore > 21) {
                    channel.send("Your hand:\n" + showHand(playerHand) + "\nBust!\n" + botTurn(playerScore, botScore, botHand, myDeck, deckIndex));
                    gameStatus = "gameDone";
                    collector.stop();
                } else {
                    channel.send("Your hand:\n" + showHand(playerHand) + "\nWhat would you like to do?\n`Hit` `Stand` `Cancel`");
                }
                break;
            case (m == "stand"):
                channel.send("You decide to stand\n" + botTurn(playerScore, botScore, botHand, myDeck, deckIndex));
                gameStatus = "gameDone";
                collector.stop();
                break;
            case (m == "cancel"):
                gameStatus = "gameCancelled";
                collector.stop();
                break;
            default:
                channel.send("Invalid command. Please reply with one of the following:\n`Hit` `Stand` `Cancel`");
                break;
        }
    })

    collector.on('end', () => {
        switch (gameStatus) {
            case "gameCancelled":
                channel.send("The game has been cancelled");
                break;
            case "playerTurn":
                channel.send("You took too long to respond. The game has been cancelled");
                break;
        }
    })
}

//Function to 'shuffle' an array by mixing its values
function shuffleDeck(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

//QoL function for displaying full hand
function showHand(hand) {
    var returnValue = "";
    for (var card of hand) {
        returnValue += "`" + card.val + card.suit + "` ";
    }
    return returnValue;
}

//Function to calculate the numerical value of a player's hand
function calculateScore(hand) {
    var returnValue = 0;
    var numOfAces = 0;
    for (var card of hand) {
        switch (card.val) {
            case "A":
                numOfAces++;
                break;
            case "J":
            case "Q":
            case "K":
                returnValue += 10;
                break;
            default:
                returnValue += parseInt(card.val);
                break;
        }
    }
    if (numOfAces > 0) {
        for (i = 0; i < numOfAces; i++) {
            returnValue += returnValue <= 10 ? 11 : 1;
        }
    }
    return returnValue;
}

//This is the function to call when the bot takes its turn
function botTurn(playerScore, botScore, botHand, myDeck, deckIndex) {
    var botResponse = "My hand:\n" + showHand(botHand) + "\n";
    //Bot hits if it is losing
    if (botScore < playerScore && playerScore <= 21) {
        while (botScore < playerScore && botScore < 21) {       //Loop breaks if the bot is winning or busts
            botResponse += "I decide to `Hit`\n";
            botHand.push(myDeck[deckIndex]);
            deckIndex++;
            botScore = calculateScore(botHand);
            botResponse += "My hand:\n" + showHand(botHand) + "\n";
        }
    }
    botResponse += (botScore > 21 ? "Bust!\n" : "I decide to `Stand`\n");
    //Bot turn is over, decide who won
    if ((botScore > playerScore && botScore <= 21) || (playerScore > 21 && botScore <= 21)) {
        botResponse += "You lose! Better luck next time!";
    } else if ((botScore < playerScore && playerScore <= 21) || (botScore > 21 && playerScore <= 21)) {
        botResponse += "You win! Congratulations!";
    } else {
        botResponse += "It's a draw!";
    }
    return botResponse;
}