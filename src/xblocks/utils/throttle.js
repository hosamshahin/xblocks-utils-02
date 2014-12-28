/* global xblocks, global */
/* jshint strict: false */

/**
 * Выполнение функции не чаще одного раза в указанный период
 */
xblocks.utils.throttle = function(callback, delay, context) {
    delay = Number(delay || 250);
    var throttle = 0;

    return function() {
        if (throttle) {
            return;
        }

        throttle = global.setTimeout(function() {
            throttle = 0;
        }, delay);

        callback.apply(context || this, arguments);
    };
};
