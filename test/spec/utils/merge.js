/* global describe, it, expect, xblocks, beforeEach */
/* jshint strict: false */

describe('xblocks.utils.merge', function() {
    beforeEach(function() {
        this.util = xblocks.utils.merge;
    });

    it('Должен вернуть объединенный объект', function() {
        var obj = { test1: 1 };
        this.util(obj, { test2: 2 });
        expect(obj).to.be.eql({ test1: 1, test2: 2 });
    });

    it('Должен вернуть объединенный объект, без учета вложенности', function() {
        var obj = { test1: { test2: 2 } };
        this.util(obj, { test1: 1 }, { test2: 2 });
        expect(obj).to.be.eql({ test1: 1, test2: 2 });
    });

    it('Если первый аргумент true, должен вернуть объединенный объект, с учетом вложенности', function() {
        var obj = { test1: { test2: 2 } };
        this.util(true, obj, { test1: { test3: 3 } }, { test4: 4 });
        expect(obj).to.be.eql({ test1: { test2: 2, test3: 3 }, test4: 4 });
    });
});
