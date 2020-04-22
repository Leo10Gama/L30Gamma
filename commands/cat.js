//We need properCase command
const proper = require('./properCase');
//Declare list of cats
class Cat {
    constructor(name, size) {
        this.catName = name;
        this.catSize = size;
    }
}
const CATS = [new Cat("ollie", 23), new Cat("mushu", 8), new Cat("achilles", 5), new Cat("luna", 8), new Cat("winter", 6)];

//List all cats available to see
exports.listCats = function () {
    var returnValue = "Current list of cats:\n";
    for (var i = 0; i < CATS.length; i++) {
        returnValue += (proper.properCase(CATS[i].catName) + "\n");
    }
    return returnValue;
}

//A cat's name exists in the system
exports.hasCat = function (name) {
    var returnValue = false;
    var i = 0;
    while (i < CATS.length && !returnValue) {
        returnValue = CATS[i].catName == name;
        i++;
    }
    return returnValue;
}

//Send a cat
//Pre: "cat" is a string already in the array CATS, or it is undefined
exports.sendCat = function (cat) {
    var catId = -1;
    //See either a specific cat or a random one (if parameter is given)
    if (typeof cat !== "undefined") {
        var i = 0;
        while (catId == -1) {
            catId = CATS[i].catName == cat ? i : -1;
            i++;
        }
    } else {
        catId = Math.floor(Math.random() * CATS.length);
    }
    var returnValue = ["Presenting... " + proper.properCase(CATS[catId].catName) + "!",
    { files: ["./cats/" + CATS[catId].catName + "/" + Math.floor(Math.random() * CATS[catId].catSize) + ".jpg"] }];
    return returnValue;
}