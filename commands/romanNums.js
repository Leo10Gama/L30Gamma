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
        } else {
            throw error;
        }
        return returnVal;
    } catch {
        return "Please enter a valid number between 1-3999";
    }
}

//Translate a single digit into its roman numeral (assumes digit is [0-9], one five and ten are characters)
function translateDigit(digit, one, five, ten) {
    switch (true) {
        case (digit <= 3 && digit > 0):
            var returnVal = "";
            for (var i = 0; i < digit; i++) returnVal += one;
            return returnVal;
        case (digit == 4):
            return (one + five);
        case (digit == 5):
            return five;
        case (digit <= 8 && digit > 5):
            var returnVal = five;
            for (var i = 0; i < (digit % 5); i++) returnVal += one;
            return returnVal;
        case (digit == 9):
            return one + ten;
        default:
            return "";
    }
}