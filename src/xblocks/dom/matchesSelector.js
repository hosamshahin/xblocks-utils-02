/* global xblocks, indexOf, global */
/* jshint strict: false */

xblocks.dom.matchesSelector = (function() {
    var proto = global.Element.prototype;
    var matches = proto.matches ||
        proto.matchesSelector ||
        proto.webkitMatchesSelector ||
        proto.mozMatchesSelector ||
        proto.msMatchesSelector ||
        proto.oMatchesSelector ||
        function(selector) {
            return (indexOf.call((this.parentNode || this.ownerDocument).querySelectorAll(selector), this) !== -1);
        };

    return function(element, selector) {
        return (element.nodeType === 1 ? matches.call(element, selector) : false);
    };

}());
