/* global xblocks, global */
/* jshint strict: false */

xblocks.utils.debounce = function(callback, delay, context) {
    var args;
    var maxTimeoutId;
    var result;
    var stamp;
    var timeoutId;
    var trailingCall;
    var lastCalled = 0;
    var maxWait = false;
    var trailing = false;
    var leading = true;
    var contextCall;

    delay = Number(delay || 250);

    function delayed() {
        var now = Date.now();
        var remaining = delay - (now - stamp);

        if (remaining <= 0 || remaining > delay) {
            if (maxTimeoutId) {
                global.clearTimeout(maxTimeoutId);
            }

            var isCalled = trailingCall;
            maxTimeoutId = timeoutId = trailingCall = undefined;

            if (isCalled) {
                lastCalled = now;
                result = callback.apply(contextCall, args);

                if (!timeoutId && !maxTimeoutId) {
                    args = contextCall = null;
                }
            }

        } else {
            timeoutId = global.setTimeout(delayed, remaining);
        }
    }

    function maxDelayed() {
        if (timeoutId) {
            global.clearTimeout(timeoutId);
        }

        maxTimeoutId = timeoutId = trailingCall = undefined;

        if (trailing || (maxWait !== delay)) {
            lastCalled = Date.now();
            result = callback.apply(contextCall, args);

            if (!timeoutId && !maxTimeoutId) {
                args = contextCall = null;
            }
        }
    }

    return function() {
        args = arguments;
        contextCall = (context || this);
        stamp = Date.now();
        trailingCall = trailing && (timeoutId || !leading);

        var leadingCall;
        var isCalled;
        var remaining;

        if (maxWait === false) {
            leadingCall = leading && !timeoutId;

        } else {
            if (!maxTimeoutId && !leading) {
                lastCalled = stamp;
            }

            remaining = maxWait - (stamp - lastCalled);
            isCalled = remaining <= 0 || remaining > maxWait;

            if (isCalled) {
                if (maxTimeoutId) {
                    maxTimeoutId = global.clearTimeout(maxTimeoutId);
                }

                lastCalled = stamp;
                result = callback.apply(contextCall, args);

            } else if (!maxTimeoutId) {
                maxTimeoutId = global.setTimeout(maxDelayed, remaining);
            }
        }

        if (isCalled && timeoutId) {
            timeoutId = global.clearTimeout(timeoutId);

        } else if (!timeoutId && delay !== maxWait) {
            timeoutId = global.setTimeout(delayed, delay);
        }

        if (leadingCall) {
            isCalled = true;
            result = callback.apply(contextCall, args);
        }

        if (isCalled && !timeoutId && !maxTimeoutId) {
            args = contextCall = null;
        }

        return result;
    };
};
