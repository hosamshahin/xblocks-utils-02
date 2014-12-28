/* global describe, it, expect, xblocks, sinon */
/* jshint strict: false */

describe('xblocks.utils.debounce ->', function() {

    it('функция должна быть вызвана один раз', function() {
        var callback = sinon.spy();
        var debounceCallback = xblocks.utils.debounce(callback);

        debounceCallback();
        debounceCallback();

        expect(callback.calledOnce).to.be.ok();
    });

    it('функция должна быть вызвана, если с момента предыдущего вызова прошло время, указанное в debounce', function(done) {
        var callback = sinon.spy();
        var debounceCallback = xblocks.utils.debounce(callback, 100);

        debounceCallback();
        debounceCallback();

        setTimeout(function() {
            debounceCallback();
            debounceCallback();

            expect(callback.callCount).to.be.eql(2);
            done();
        }, 150);
    });

    it('отсчет времени задержки начинается сначала с момента последнего вызова', function(done) {
        var callback = sinon.spy();
        var debounceCallback = xblocks.utils.debounce(callback, 100);

        debounceCallback();

        setTimeout(function() {
            debounceCallback();

            setTimeout(function() {
                debounceCallback();

                setTimeout(function() {
                    debounceCallback();

                    expect(callback.callCount).to.be.eql(2);
                    done();
                }, 150);
            }, 60);
        }, 60);
    });

});
