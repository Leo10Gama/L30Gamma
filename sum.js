exports.sumThings = function (items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        if (!isNaN(items[i])) {
            total += items[i];
        }
    }
    return total;
}