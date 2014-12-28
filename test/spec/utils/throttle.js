/* global describe, it, expect, xblocks, sinon */
/* jshint strict: false */

describe('xblocks.utils.throttle ->', function() {

    it('функция должна быть вызвана один раз', function() {
        var callback = sinon.spy();
        var throttleCallback = xblocks.utils.throttle(callback, 100);

        throttleCallback();
        throttleCallback();

        expect(callback.calledOnce).to.be.ok();
    });

});
