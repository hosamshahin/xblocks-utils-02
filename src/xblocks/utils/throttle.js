/* global xblocks */
/* jshint strict: false */

// вынести
xblocks.utils.throttle = function(callback, delay, scope) {
    delay = delay || 250;
    var last;
    var timer;

    return function() {
        var context = scope || this;
        var now = Date.now();
        var args = arguments;

        if (last && now < last + delay) {
            clearTimeout(timer);

            timer = setTimeout(function() {
                last = now;
                callback.apply(context, args);
            }, delay);

        } else {
            last = now;
            callback.apply(context, args);
        }
    };
};
