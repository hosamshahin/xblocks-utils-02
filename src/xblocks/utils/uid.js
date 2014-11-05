/* global xblocks */
/* jshint strict: false */

/**
 * Generate unique string
 * @returns {string}
 */
xblocks.utils.uid = function() {
    return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};
