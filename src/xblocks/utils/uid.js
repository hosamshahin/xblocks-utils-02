/* global xblocks, global */
/* jshint strict: false */

/**
 * Generate unique string
 * @returns {string}
 */
xblocks.utils.uid = function() {
    return global.Math.floor((1 + global.Math.random()) * 0x10000000).toString(36);
};
