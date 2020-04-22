exports.speak = function () {
    var x = Math.floor(Math.random() * 100);
    switch (true) {
        case (x <= 50):
            return "meow";
        case (x <= 70):
            return "*meow*";
        case (x <= 85):
            return "**meow**";
        case (x <= 95):
            return "__meow__";
        default:
            return "01101101 01100101 01101111 01110111";
    }
}