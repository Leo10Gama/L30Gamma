const maths = ["+", "-", "*", "/", "%", "^"];

exports.compute = function (expression) {
    //Figure out what operation we're doing
    var operation;
    var nums;
    for (var i = 0; i < expression.length; i++) {
      if (maths.indexOf(expression.charAt(i)) > -1) {
        operation = expression.charAt(i);
        nums = expression.split(expression.charAt(i));
      }
    }
    try {
      if (nums.length == 2) {
        switch (operation) {
          case maths[0]:
            return parseInt(nums[0]) + parseInt(nums[1]);
            break;
          case maths[1]:
            return parseInt(nums[0]) - parseInt(nums[1]);
            break;
          case maths[2]:
            return parseInt(nums[0]) * parseInt(nums[1]);
            break;
          case maths[3]:
            return parseInt(nums[0]) / parseInt(nums[1]);
            break;
          case maths[4]:
            return parseInt(nums[0]) % parseInt(nums[1]);
            break;
          case maths[5]:
            return Math.pow(parseInt(nums[0]), parseInt(nums[1]));
            break;
          default:
            return "Whoopsies, something happened that shouldn't've happened...";
            break;
        }
      }
    } catch (error) {
      return "Enter a valid expression after g.math to use the function properly!!";
    }
}