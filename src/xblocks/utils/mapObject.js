/* global xblocks */
/* jshint strict: false */

/**
 * @param {object} from
 * @param {function} [callback]
 * @returns {object}
 */
xblocks.utils.mapObject = function(from, callback) {
    var obj = {};
    var props = {};
    var fill = false;

    Object.keys(from).forEach(function(property) {
        var descr = Object.getOwnPropertyDescriptor(from, property);
        var map = callback && callback(property, descr);
        if (xblocks.utils.type(map) === 'object') {
            props[ map.name ] = map.descr;
            fill = true;
        }
    });

    if (fill) {
        Object.defineProperties(obj, props);
    }

    return obj;
};
