/* global xblocks, global */
/* jshint strict: false */

xblocks.utils.debounce = function(callback, delay, scope) {
    delay = Number(delay || 250);
    var timer = null;

    return function() {
        var context = scope || this;
        var args = arguments;

        global.clearTimeout(timer);

        timer = global.setTimeout(function() {
            callback.apply(context, args);
        }, delay);
    };
};
