/* global describe, it, expect, xblocks, sinon, beforeEach */
/* jshint strict: false */

describe('xblocks.utils.pristine', function() {
    beforeEach(function() {
        this.util = xblocks.utils.pristine;
    });

    it('Должна вернуть true, если глобальный объект не переопределен', function() {
        expect(this.util('setTimeout')).to.be.ok();
    });

    it('Должна вернуть false, если глобальный объект переопределен', function() {
        sinon.stub(window, 'setTimeout');
        expect(this.util('setTimeout')).to.not.ok();
        window.setTimeout.restore();
    });
});
