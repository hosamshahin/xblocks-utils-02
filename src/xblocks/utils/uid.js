/* global xblocks */
/* jshint strict: false */

// вынести
/**
 * Generate unique string
 * @returns {string}
 */
xblocks.utils.uid = function() {
    return Math.floor((1 + Math.random()) * 0x10000000 + Date.now()).toString(36);
};
