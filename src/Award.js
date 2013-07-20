exports = Class(Award, function (supr) {
    this.hasEarned = function () {
        return false;
    };

    this.justEarned = function () {
        return false;
    };
});

