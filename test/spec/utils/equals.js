/* global describe, it, expect, xblocks, beforeEach */
/* jshint strict: false */

describe('xblocks.utils.equals', function() {

    beforeEach(function() {
        this.util = xblocks.utils.equals;
    });

    [
        [1, 1],
        [true, true],
        ['test', 'test'],
        [null, null],
        [undefined, undefined]
    ].forEach(function(params) {
            it('Должен вернуть true для элементов одного типа и одинакового значения: ' + JSON.stringify(params), function() {
                expect(this.util(params[0], params[1])).to.be.ok();
            });
        });

    it('NaN не эквивалентен самому себе', function() {
        expect(this.util(NaN, NaN)).to.not.ok();
    });

    it('Функция эквивалентна самой себе', function() {
        var test = function() {};
        expect(this.util(test, test)).to.be.ok();
    });

    it('Объект эквивалентен самому себе', function() {
        var test = {};
        expect(this.util(test, test)).to.be.ok();
    });

    it('Функции ставнивает по содержимому toString', function() {
        expect(this.util(function() {}, function() {})).to.be.ok();
    });

    it('Объекты эквивалентны если содержат одинаковый набор эквивалентных свойств', function() {
        expect(this.util({test: 1}, {test: 1})).to.be.ok();
        expect(this.util({test: 1}, {test: '1'})).to.not.ok();
        expect(this.util({test1: 1}, {test2: 1})).to.not.ok();
        expect(this.util({test: {asd: 'qwe'}}, {test: {asd: 'qwe'}})).to.be.ok();
        expect(this.util({test: {asd1: 'qwe'}}, {test: {asd2: 'qwe'}})).to.not.ok();
    });
});
