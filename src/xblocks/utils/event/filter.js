/* global xblocks */
/* jshint strict: false */

// вынести
/**
 * @param {HTMLElement} element
 * @param {Event} event mouseover or mouseout event
 * @param {function} callback
 */
xblocks.utils.event.mouseEnterFilter = function(element, event, callback) {
    var toElement = event.relatedTarget || event.srcElement;

    while (toElement && toElement !== element) {
        toElement = toElement.parentNode;
    }

    if (toElement === element) {
        return;
    }

    return callback.call(element, event);
};

xblocks.utils.event.mouseLeaveFilter = xblocks.utils.event.mouseEnterFilter;
