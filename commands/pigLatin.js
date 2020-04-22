//Main function
exports.toPL = function (phrase) {
    var returnValue = "";
        for (var i = 0; i < phrase.length; i++) {
          returnValue += pigLatin(phrase[i]) + " ";
        }
        return returnValue;
}

//Local function
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