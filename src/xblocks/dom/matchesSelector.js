/* global xblocks */
/* jshint strict: false */

// вынести
xblocks.dom.matchesSelector = (function() {
    var ElementPrototype = Element.prototype;
    var matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        function(selector) {
            return (Array.prototype.indexOf.call((this.parentNode || this.ownerDocument).querySelectorAll(selector), this) !== -1);
        };

    return function(element, selector) {
        return (element.nodeType === 1 ? matches.call(element, selector) : false);
    };

}());
