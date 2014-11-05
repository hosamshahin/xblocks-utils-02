/* global xblocks */
/* jshint strict: false */

xblocks.utils.debounce = function(callback, delay, scope) {
    delay = Number(delay || 250);
    var timer = null;

    return function() {
        var context = scope || this;
        var args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function() {
            callback.apply(context, args);
        }, delay);
    };
};
