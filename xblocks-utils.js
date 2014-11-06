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
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    /* xblocks/utils.js begin */
// Time
/* xblocks/utils/debounce.js begin */
/* global xblocks */
/* jshint strict: false */

xblocks.utils.debounce = function(callback, delay, scope) {
    delay = Number(delay || 250);
    var timer = null;

    return function() {
        var context = scope || this;
        var args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function() {
            callback.apply(context, args);
        }, delay);
    };
};

/* xblocks/utils/debounce.js end */

/* xblocks/utils/throttle.js begin */
/* global xblocks */
/* jshint strict: false */

xblocks.utils.throttle = function(callback, delay, scope) {
    delay = Number(delay || 250);
    var last;
    var timer;

    return function() {
        var context = scope || this;
        var now = Date.now();
        var args = arguments;

        if (last && now < last + delay) {
            clearTimeout(timer);

            timer = setTimeout(function() {
                last = now;
                callback.apply(context, args);
            }, delay);

        } else {
            last = now;
            callback.apply(context, args);
        }
    };
};

/* xblocks/utils/throttle.js end */

/* xblocks/utils/microtask.js begin */
/* global global, xblocks */
/* jshint strict: false */

xblocks.utils.microtask = (function() {
    var iterations = 0;
    var callbacks = [];
    var twiddle = global.document.createTextNode('');
    var Mutation = global.MutationObserver || global.JsMutationObserver;

    (new Mutation(function() {
        while (callbacks.length) {
            callbacks.shift()();
        }

    })).observe(twiddle, {
        characterData: true
    });

    return function(callback) {
        twiddle.textContent = iterations++;
        callbacks.push(callback);
    };

}());

/* xblocks/utils/microtask.js end */


// Traverse
/* xblocks/utils/filterObject.js begin */
/* global xblocks */
/* jshint strict: false */

/**
 * @param {object} from
 * @param {function} [callback]
 * @returns {object}
 */
xblocks.utils.filterObject = function(from, callback) {
    var obj = {};
    var props = {};
    var fill = false;

    Object.keys(from).forEach(function(property) {
        var descr = Object.getOwnPropertyDescriptor(from, property);
        if (callback && callback(property, descr)) {
            props[ property ] = descr;
            fill = true;
        }
    });

    if (fill) {
        Object.defineProperties(obj, props);
    }

    return obj;
};

/* xblocks/utils/filterObject.js end */

/* xblocks/utils/mapObject.js begin */
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

/* xblocks/utils/mapObject.js end */


// Checkers
/* xblocks/utils/isEmptyObject.js begin */
/* global xblocks, hasOwnProperty */
/* jshint strict: false */

/**
 * @param {*} obj
 * @returns {boolean}
 */
xblocks.utils.isEmptyObject = function(obj) {
    if (xblocks.utils.type(obj) === 'object') {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
    }

    return true;
};

/* xblocks/utils/isEmptyObject.js end */

/* xblocks/utils/isWindow.js begin */
/* global xblocks */
/* jshint strict: false */

/**
 * @param {*} obj
 * @returns {boolean}
 */
xblocks.utils.isWindow = function(obj) {
    return (obj !== null && obj === obj.window);
};

/* xblocks/utils/isWindow.js end */


// Other
/* xblocks/utils/uid.js begin */
/* global xblocks */
/* jshint strict: false */

/**
 * Generate unique string
 * @returns {string}
 */
xblocks.utils.uid = function() {
    return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};

/* xblocks/utils/uid.js end */


/* xblocks/utils.js end */

    /* xblocks/dom.js begin */
/* xblocks/dom/index.js begin */
/* global xblocks, global, indexOf */
/* jshint strict: false */

xblocks.dom.index = function(selector, element, context) {
    return indexOf.call((context || global.document).querySelectorAll(selector), element);
};

/* xblocks/dom/index.js end */

/* xblocks/dom/isParent.js begin */
/* global xblocks, global */
/* jshint strict: false */

xblocks.dom.isParent = (function() {
    var root = global.document.documentElement;

    if ('compareDocumentPosition' in root) {
        return function(container, element) {
            /*jshint -W016 */
            return (container.compareDocumentPosition(element) & 16) == 16;
        };

    } else if ('contains' in root) {
        return function(container, element) {
            return container !== element && container.contains(element);
        };

    } else {
        return function(container, element) {
            while ((element = element.parentNode)) {
                if (element === container) {
                    return true;
                }
            }

            return false;
        };
    }
}());

/* xblocks/dom/isParent.js end */

/* xblocks/dom/matchesSelector.js begin */
/* global xblocks, indexOf */
/* jshint strict: false */

xblocks.dom.matchesSelector = (function() {
    var ElementPrototype = Element.prototype;
    var matches = ElementPrototype.matches ||
        ElementPrototype.matchesSelector ||
        ElementPrototype.webkitMatchesSelector ||
        ElementPrototype.mozMatchesSelector ||
        ElementPrototype.msMatchesSelector ||
        ElementPrototype.oMatchesSelector ||
        function(selector) {
            return (indexOf.call((this.parentNode || this.ownerDocument).querySelectorAll(selector), this) !== -1);
        };

    return function(element, selector) {
        return (element.nodeType === 1 ? matches.call(element, selector) : false);
    };

}());

/* xblocks/dom/matchesSelector.js end */

/* xblocks/dom/eachInnerFollowing.js begin */
/**
 * Проход по всем потомкам в прямом порядке (от певой до последней)
 */
xblocks.dom.eachInnerFollowing = function(node, callback) {
    var stack = [ node ];
    var item;
    var cbcall;
    var childsLength;

    while ((item = stack.pop())) {
        cbcall = callback && callback(item, stack);

        if (typeof(cbcall) !== 'undefined' && !cbcall) {
            return false;

        } else if (cbcall === 'next') {
            continue;
        }

        if (item.nodeType !== 1) {
            continue;
        }

        if (!item.hasChildNodes()) {
            continue;
        }

        childsLength = item.childNodes.length;

        while (childsLength--) {
            stack.push(item.childNodes[childsLength]);
        }
    }

    return true;
};

/* xblocks/dom/eachInnerFollowing.js end */

/* xblocks/dom/eachInnerPrevious.js begin */
/**
 * Проход по всем потомкам в обратном порядке (от последней до первой)
 */
xblocks.dom.eachInnerPrevious = function(node, callback) {
    var stack = [ node ];
    var item;
    var cbcall;
    var i;
    var childsLength;

    while ((item = stack.pop())) {
        cbcall = callback && callback(item, stack);

        if (typeof(cbcall) !== 'undefined' && !cbcall) {
            return false;

        } else if (cbcall === 'next') {
            continue;
        }

        if (item.nodeType !== 1) {
            continue;
        }

        if (!item.hasChildNodes()) {
            continue;
        }

        childsLength = item.childNodes.length;
        i = 0;

        for (; i < childsLength; i++) {
            stack.push(item.childNodes[i]);
        }
    }

    return true;
};

/* xblocks/dom/eachInnerPrevious.js end */

/* xblocks/dom/eachBefore.js begin */
xblocks.dom.eachBefore = function(node, callback, context, inner) {
    inner = (typeof(inner) === 'undefined' ? true : Boolean(inner));
    var prev;
    var cbcall;

    do {
        if (context && !xblocks.dom.isParent(context, node)) {
            return;
        }

        prev = node;

        while ((prev = prev.previousSibling)) {
            cbcall = inner ? xblocks.dom.eachInnerPrevious(prev, callback) : (callback && callback(prev));

            if (typeof(cbcall) !== 'undefined' && !cbcall) {
                return false;
            }
        }

    } while ((node = node.parentNode));
};

/* xblocks/dom/eachBefore.js end */

/* xblocks/dom/eachAfter.js begin */
xblocks.dom.eachAfter = function(node, callback, context, inner) {
    inner = (typeof(inner) === 'undefined' ? true : Boolean(inner));
    var next;
    var cbcall;

    do {
        if (context && !xblocks.dom.isParent(context, node)) {
            return;
        }

        next = node;

        while ((next = next.nextSibling)) {
            cbcall = inner ? xblocks.dom.eachInnerFollowing(next, callback) : (callback && callback(next));

            if (typeof(cbcall) !== 'undefined' && !cbcall) {
                return false;
            }
        }

    } while ((node = node.parentNode));
};

/* xblocks/dom/eachAfter.js end */


/* xblocks/dom.js end */

    /* xblocks/event.js begin */
/* xblocks/event/delegate.js begin */
/* global xblocks */
/* jshint strict: false */

xblocks.event.delegate = function(selector, callback) {

    return function(event) {
        var target = event.target || event.srcElement;
        var match;

        if (!target.tagName) {
            return;
        }

        if (xblocks.dom.matchesSelector(target, selector)) {
            match = target;

        } else if (xblocks.dom.matchesSelector(target, selector + ' *')) {
            var parent = target.parentNode;

            while (parent) {
                if (xblocks.dom.matchesSelector(parent, selector)) {
                    match = parent;
                    break;
                }

                parent = parent.parentNode;
            }
        }

        if (!match) {
            return;
        }

        event.delegateElement = match;
        callback.call(match, event);
    };
};

/* xblocks/event/delegate.js end */

/* xblocks/event/filterClick.js begin */
/* global xblocks */
/* jshint strict: false */

xblocks.event._clickWhich = {
    1: 'left',
    2: 'center',
    3: 'right'
};

xblocks.event.filterClick = function(which, callback) {
    which = Array.isArray(which) ? which : [ which ];

    return function(event) {
        if (event.type !== 'click') {
            return;
        }

        var whichEvt = event.which;

        if (!whichEvt && event.button) {
            /* jshint -W016 */
            if (event.button & 1) {
                whichEvt = 1;
            } else if (event.button & 4) {
                whichEvt = 2;
            } else if (event.button & 2) {
                whichEvt = 3;
            }
        }

        whichEvt = xblocks.event._clickWhich[ whichEvt ];

        if (which.indexOf(whichEvt) !== -1) {
            callback.call(this, event);
        }
    };
};

/* xblocks/event/filterClick.js end */

/* xblocks/event/filterMouse.js begin */
/* global xblocks */
/* jshint strict: false */

/**
 * @param {HTMLElement} element
 * @param {Event} event mouseover or mouseout event
 * @param {function} callback
 */
xblocks.event.filterMouseEnter = function(element, event, callback) {
    var toElement = event.relatedTarget || event.srcElement;

    while (toElement && toElement !== element) {
        toElement = toElement.parentNode;
    }

    if (toElement === element) {
        return;
    }

    return callback.call(element, event);
};

xblocks.event.filterMouseLeave = xblocks.event.filterMouseEnter;

/* xblocks/event/filterMouse.js end */


/* xblocks/event.js end */


}(function() {
    return this || (1, eval)('this');
}()));
