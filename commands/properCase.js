exports.properCase = function (word) {
    var thing2return = "";
    try {
        if (word.charAt(0) >= 'a' && word.charAt(0) <= 'z') {
            thing2return += word.charAt(0).toUpperCase();
            thing2return += word.slice(1);
        } else {
            thing2return = word;
        }
    } catch(err) {
        return word;
    }
    return thing2return;
}