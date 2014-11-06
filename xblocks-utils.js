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

/* xblocks/utils/table.js begin */

xblocks.utils.Table = function(node, options) {
    this._options = xblocks.utils.merge({
        'col': 'xb-menu:not([disabled])',
        'row': 'xb-menuitem:not([disabled])',
        'colLoop': false,
        'rowLoop': false
    }, options);

    this._node = node;
    this._item = undefined;
    this._originalEvent = undefined;

    this._onKeydown = this._onKeydown.bind(this);

    this._onMouseover = xblocks.event.delegate(
        this._options.row,
        this._onMouseover.bind(this)
    );

    this._onMouseout = xblocks.event.delegate(
        this._options.row,
        this._onMouseout.bind(this)
    );

    this._onMousemove = xblocks.utils.throttle(
        xblocks.event.delegate(
            this._options.row,
            this._onMouseAction.bind(this)
        )
    );

    this._onClick = xblocks.event.filterClick('left',
        xblocks.event.delegate(
            this._options.row,
            this._onMouseAction.bind(this)
        )
    );

    this._bind();
};

xblocks.utils.Table.prototype = {
    EVENT_BLUR: 'xb-blur',
    EVENT_FOCUS: 'xb-focus',

    destroy: function() {
        this._unbind();
        this._node = undefined;
        this._originalEvent = undefined;

        if (this._item) {
            xblocks.event.dispatch(this._item, this.EVENT_BLUR);
            // "_item" must live for the proper event handling
            //this._item = undefined;
        }
    },

    getItem: function() {
        return this._item;
    },

    _bind: function() {
        this._node.addEventListener('keydown', this._onKeydown, false);
        this._node.addEventListener('click', this._onClick, false);
        this._node.addEventListener('mouseover', this._onMouseover, false);
        this._node.addEventListener('mouseout', this._onMouseout, false);
        this._node.addEventListener('mousemove', this._onMousemove, false);
    },

    _unbind: function() {
        this._node.removeEventListener('keydown', this._onKeydown, false);
        this._node.removeEventListener('click', this._onClick, false);
        this._node.removeEventListener('mouseover', this._onMouseover, false);
        this._node.removeEventListener('mouseout', this._onMouseout, false);
        this._node.removeEventListener('mousemove', this._onMousemove, false);
    },

    _col: function(item) {
        if (!item) {
            return;
        }

        var col = item;
        while ((col = col.parentNode)) {
            if (xblocks.dom.matchesSelector(col, this._options.col)) {
                return col;
            }

            if (col === this._node) {
                break;
            }
        }
    },

    _colFirst: function() {
        return this._node.querySelector(this._options.col) || this._node;
    },

    _colLast: function() {
        return Array.prototype.pop.call(Array.prototype.slice.call(this._node.querySelectorAll(this._options.col))) || this._node;
    },

    _colMatchIterate: function(data, element) {
        if (xblocks.dom.matchesSelector(element, this._options.col)) {
            data.col = element;
            return false;
        }
    },

    _colNext: function(col) {
        var data = {};
        xblocks.dom.eachAfter(col, this._colMatchIterate.bind(this, data), this._node, false);
        return data.col;
    },

    _colPrev: function(col) {
        var data = {};
        xblocks.dom.eachBefore(col, this._colMatchIterate.bind(this, data), this._node, false);
        return data.col;
    },

    _rowFirst: function(col) {
        return col.querySelector(this._options.row);
    },

    _rowLast: function(col) {
        return Array.prototype.pop.call(Array.prototype.slice.call(col.querySelectorAll(this._options.row)));
    },

    _rowMatchIterate: function(data, element) {
        if (xblocks.dom.matchesSelector(element, this._options.row)) {
            data.row = element;
            return false;
        }
    },

    _rowNext: function(row) {
        var data = {};
        xblocks.dom.eachAfter(row, this._rowMatchIterate.bind(this, data), this._col(row), false);
        return data.row;
    },

    _rowPrev: function(row) {
        var data = {};
        xblocks.dom.eachBefore(row, this._rowMatchIterate.bind(this, data), this._col(row), false);
        return data.row;
    },

    _rowIndex: function(row) {
        return xblocks.dom.index(this._options.row, row, this._col(row));
    },

    _rowByIndex: function(col, idx) {
        return col.querySelectorAll(this._options.row)[idx];
    },

    _focus: function(element) {
        if (element === this._item) {
            return;
        }

        if (this._item) {
            xblocks.event.dispatch(this._item, this.EVENT_BLUR, {
                'detail': { 'originalEvent': this._originalEvent }
            });
        }

        this._item = element;
        xblocks.event.dispatch(this._item, this.EVENT_FOCUS, {
            'detail': { 'originalEvent': this._originalEvent }
        });
    },

    _onKeydown: function(event) {
        if (event.altKey || event.metaKey || event.shiftKey) {
            return;
        }

        this._originalEvent = event;

        switch (event.keyCode) {
            case 37: // ArrowLeft
                this._onArrowLeft();
                break;
            case 38: // ArrowUp
                this._onArrowUp();
                break;
            case 39: // ArrowRight
                this._onArrowRight();
                break;
            case 40: // ArrowDown
                this._onArrowDown();
                break;
        }
    },

    _onMouseAction: function(event) {
        if (!this._item || this._item !== event.delegateElement) {
            this._originalEvent = event;
            this._focus(event.delegateElement);
        }
    },

    _onMouseover: function(event) {
        xblocks.event.filterMouseEnter(event.delegateElement, event, this._onMouseAction.bind(this));
    },

    _onMouseout: function(event) {
        xblocks.event.filterMouseLeave(event.delegateElement, event, this._onMouseAction.bind(this));
    },

    _onArrowLeft: function() {
        if (!this._item) {
            this._focus(this._rowFirst(this._colFirst()));

        } else {
            var idx = this._rowIndex(this._item);
            var col = this._colPrev(this._col(this._item));

            if (!col) {
                col = this._colLast();
                if (!this._options.colLoop) {
                    idx--;
                }
            }

            var row = this._rowByIndex(col, idx);

            if (!row) {
                row = this._rowLast(col);
            }

            this._focus(row);
        }
    },

    _onArrowRight: function() {
        if (!this._item) {
            this._focus(this._rowFirst(this._colFirst()));

        } else {
            var idx = this._rowIndex(this._item);
            var col = this._colNext(this._col(this._item));

            if (!col) {
                col = this._colFirst();
                if (!this._options.colLoop) {
                    idx++;
                }
            }

            var row = this._rowByIndex(col, idx);

            if (!row) {
                row = this._rowFirst(col);
            }

            this._focus(row);
        }
    },

    _onArrowUp: function() {
        if (!this._item) {
            this._focus(this._rowFirst(this._colFirst()));

        } else {
            var row = this._rowPrev(this._item);

            if (!row) {
                var col;

                if (this._options.rowLoop) {
                    col = this._col(this._item);

                } else {
                    col = this._colPrev(this._col(this._item)) || this._colLast();
                }

                row = this._rowLast(col);
            }

            this._focus(row);
        }
    },

    _onArrowDown: function() {
        if (!this._item) {
            this._focus(this._rowFirst(this._colFirst()));

        } else {
            var row = this._rowNext(this._item);

            if (!row) {
                var col;

                if (this._options.rowLoop) {
                    col = this._col(this._item);

                } else {
                    col = this._colNext(this._col(this._item)) || this._colFirst();
                }

                row = this._rowFirst(col);
            }

            this._focus(row);
        }
    }
};

/* xblocks/utils/table.js end */


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
