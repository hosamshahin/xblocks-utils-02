/* global xblocks */
/* jshint strict: false */

// вынести
/**
 * @param {*} obj
 * @returns {boolean}
 */
xblocks.utils.isWindow = function(obj) {
    return obj !== null && obj === obj.window;
};
