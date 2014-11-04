/* global xblocks, global */
/* jshint strict: false */

// вынести
/**
 * @param {*} obj
 * @returns {boolean}
 */
xblocks.utils.isEmptyObject = function(obj) {
    if (xblocks.utils.type(obj) === 'object') {
        for (var key in obj) {
            if (global.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
    }

    return true;
};
