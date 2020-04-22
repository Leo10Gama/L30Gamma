/*Normally, a fibonacci function would only return values for the first two terms of the sequence
* and call on itself recursively to arrive at an answer. However, using the mathematical formula 
* for the nth term is much faster. The only downside is its source of error, which occurs after 
* the 70th term. To work around this, we can employ the more traditional fibonacci method to handle 
* the larger cases, leading to a faster overall program*/
const PHI = (1 + Math.sqrt(5)) / 2;
const PSI = -Math.pow(PHI, -1);

exports.nthTerm = function (n) {
    try {
        if (n <= 70) {
            return Math.round((Math.pow(PHI, n) - Math.pow(PSI, n)) / Math.sqrt(5));
        } else {
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    } catch (err) {
        return "Please follow up the command with an integer!!";
    }
}