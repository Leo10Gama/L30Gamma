//Take any standard number and translate it into a Roman numeral (only works for [1-3999])
exports.toRoman = function (num) {
    try {
        //Start with ones column
        var returnVal = translateDigit(num % 10, 'I', 'V', 'X');
        num = Math.floor(num / 10);
        //Now tens column
        returnVal = translateDigit(num % 10, 'X', 'L', 'C') + returnVal;
        num = Math.floor(num / 10);
        //Then hundreds
        returnVal = translateDigit(num % 10, 'C', 'D', 'M') + returnVal;
        num = Math.floor(num / 10);
        //Theoretically we cannot have a thousands number over 3000, so we can calculate that here
        if (num <= 3) {
            for (var i = 0; i < num; i++) returnVal = 'M' + returnVal;
        } else throw error;
        return returnVal;
    } catch {
        return "Please enter a valid number between 1-3999";
    }
}

//Take any **valid** Roman numeral and translate it into an ordinary number (in Western Arabic notation)
exports.toStandard = function (roman) {
    try {
        console.log(`Roman value is ${roman}`);
        var total = 0;
        var next = roman.length > 1 ? roman.charAt(1) : roman.charAt(0);
        for (var i = 0; i < roman.length; i++) {
            console.log(`${roman.charAt(i)} being compared against ${next}`);
            if(translateLetter(next) > translateLetter(roman.charAt(i))) {
                total += translateLetter(next) - translateLetter(roman.charAt(i));
                i++
            } else {
                total += translateLetter(roman.charAt(i));
            }
            next = roman.length > i ? roman.charAt(i + 2) : next;
        }
        return total;
    } catch {
        return "Please enter a valid Roman numeral between I and MMMCMXCIX";
    }
}

//Translate a single digit into its roman numeral (assumes digit is [0-9], one five and ten are characters)
function translateDigit(digit, one, five, ten) {
    switch (true) {
        case ((digit <= 3 && digit > 0) || (digit <= 8 && digit > 5)):
            var returnVal = "";
            for (var i = 0; i < (digit % 5); i++) returnVal += one;
            return returnVal;
        case (digit == 4):
            return (one + five);
        case (digit == 5):
            return five;
        case (digit == 9):
            return one + ten;
        default:
            return "";
    }
}

//Retranslate a Roman digit back to a standard number between 1-9 (assume letter is a string, one five and ten are characters)
function translateLetter(letter) {
    switch (true) {
        case (letter == "I"): return 1;
        case (letter == "V"): return 5;
        case (letter == "X"): return 10;
        case (letter == "L"): return 50;
        case (letter == "C"): return 100;
        case (letter == "D"): return 500;
        case (letter == "M"): return 1000;
    }
}