/* global xblocks */
/* jshint strict: false */

/**
 * @param {HTMLElement} element
 * @param {Event} event mouseover or mouseout event
 * @param {function} callback
 */
xblocks.event.filterMouseEnter = function(element, event, callback) {
    var toElement = event.relatedTarget || event.srcElement;

    while (toElement && toElement !== element) {
        toElement = toElement.parentNode;
    }

    if (toElement === element) {
        return;
    }

    return callback.call(element, event);
};

xblocks.event.filterMouseLeave = xblocks.event.filterMouseEnter;
