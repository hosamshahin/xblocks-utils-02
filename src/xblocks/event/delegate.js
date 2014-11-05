/* global xblocks */
/* jshint strict: false */

xblocks.event.delegate = function(selector, callback) {

    return function(event) {
        var target = event.target || event.srcElement;
        var match;

        if (!target.tagName) {
            return;
        }

        if (xblocks.dom.matchesSelector(target, selector)) {
            match = target;

        } else if (xblocks.dom.matchesSelector(target, selector + ' *')) {
            var parent = target.parentNode;

            while (parent) {
                if (xblocks.dom.matchesSelector(parent, selector)) {
                    match = parent;
                    break;
                }

                parent = parent.parentNode;
            }
        }

        if (!match) {
            return;
        }

        event.delegateElement = match;
        callback.call(match, event);
    };
};
