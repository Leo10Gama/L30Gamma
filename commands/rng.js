exports.flipCoin = function () {
    return Math.random() > 0.5 ? "Heads" : "Tails";
}

exports.rollDice = function (sides) {
    return sides > 0 ? Math.floor(Math.random() * sides) + 1 : "Please enter a valid integer";
}