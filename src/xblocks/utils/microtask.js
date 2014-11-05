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
