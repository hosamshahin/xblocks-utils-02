/* global xblocks */
/* jshint strict: false */

// вынести
xblocks.utils.event._clickWhich = {
    1: 'left',
    2: 'center',
    3: 'right'
};

xblocks.utils.event.click = function(which, callback) {
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

        whichEvt = xblocks.utils.event._clickWhich[ whichEvt ];

        if (which.indexOf(whichEvt) !== -1) {
            callback.call(this, event);
        }
    };
};
