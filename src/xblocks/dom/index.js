/* global xblocks, global, indexOf */
/* jshint strict: false */

xblocks.dom.index = function(selector, element, context) {
    return indexOf.call((context || global.document).querySelectorAll(selector), element);
};
