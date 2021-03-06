/* global pop, slice */

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

    blurItem: function() {
        if (this._item) {
            xblocks.event.dispatch(this._item, this.EVENT_BLUR);
            this._item = undefined;
        }
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
        return pop.call(slice.call(this._node.querySelectorAll(this._options.col))) || this._node;
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
        return pop.call(slice.call(col.querySelectorAll(this._options.row)));
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

        var action;

        switch (event.keyCode) {
            case 37: // ArrowLeft
                action = '_onArrowLeft';
                break;
            case 38: // ArrowUp
                action = '_onArrowUp';
                break;
            case 39: // ArrowRight
                action = '_onArrowRight';
                break;
            case 40: // ArrowDown
                action = '_onArrowDown';
                break;
        }

        if (!action) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this._originalEvent = event;

        this[ action ]();
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
