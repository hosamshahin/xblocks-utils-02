/* global xblocks, global */
/* jshint strict: false */

xblocks.utils.throttle = function(callback, delay, scope) {
    delay = Number(delay || 250);
    var last;
    var timer;

    return function() {
        var context = scope || this;
        var now = Date.now();
        var args = arguments;

        if (last && now < last + delay) {
            global.clearTimeout(timer);

            timer = global.setTimeout(function() {
                last = now;
                callback.apply(context, args);
            }, delay);

        } else {
            last = now;
            callback.apply(context, args);
        }
    };
};
