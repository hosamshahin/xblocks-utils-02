/* jshint -W067 */
/* jshint unused: false */
(function(global, undefined) {
    'use strict';

    global.xblocks = global.xblocks || {};

    /**
     * @namespace xblocks
     */
    var xblocks = global.xblocks;

    xblocks.utils = xblocks.utils || {};
    xblocks.dom = xblocks.dom || {};
    xblocks.event = xblocks.event || {};

    var indexOf = Array.prototype.indexOf;
    var pop = Array.prototype.pop;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /*! borschik:include:xblocks/utils.js */
    /*! borschik:include:xblocks/dom.js */
    /*! borschik:include:xblocks/event.js */

}(function() {
    return this || (1, eval)('this');
}()));
