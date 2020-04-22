//Pre: A string is passed and checked if the reverse is the same as the forward
exports.isPalindrome = function (word) {
    var returnValue = true;
    for (var i = 0; i < word.length / 2; i++) {
        if (word.charAt(i) != word.charAt(word.length - 1 - i)) {
            returnValue = false;
        }
    }
    return returnValue;
}