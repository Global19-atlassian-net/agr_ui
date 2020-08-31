import { expect } from 'chai';
import {
  compareByFixedOrder,
  compareAlphabeticalCaseInsensitive,
  sortBy
} from '../utils';

describe('utils', () => {
  describe('#compareByFixedOrder', () => {
    const order = ['A', 'D', 'C', 'Q', 'B'];
    const compare = compareByFixedOrder(order);

    it('should return a function', () => {
      expect(compare).to.be.a('function');
    });

    it('returned function should return less than zero for ascending values', () => {
      const result = compare('D', 'Q');
      expect(result).to.be.lessThan(0);
    });

    it('returned function should return greater than zero for descending values', () => {
      const result = compare('C', 'D');
      expect(result).to.be.greaterThan(0);
    });

    it('returned function should return zero for equal values', () => {
      const result = compare('B', 'B');
      expect(result).to.equal(0);
    });

    it('returned function should return greater than zero for first value not in list', () => {
      const result = compare('X', 'A');
      expect(result).to.be.greaterThan(0);
    });

    it('returned function should return less than zero for second value not in list', () => {
      const result = compare('B', 'X');
      expect(result).to.be.lessThan(0);
    });

    it('returned function should return zero for two values not in list', () => {
      const result = compare('X', 'Y');
      expect(result).to.equal(0);
    });

    it('should accept an accessor function', () => {
      const compareWithAccessor = compareByFixedOrder(order, val => val.name);
      const a = {name: 'C', value: 2};
      const b = {name: 'D', value: 5};
      const result = compareWithAccessor(a, b);
      expect(result).to.be.greaterThan(0);
    });

    it('returned function should work with Array.sort()', () => {
      const original = ['A', 'B', 'A', 'C', 'D', 'E', 'D'];
      const expected = ['A', 'A', 'D', 'D', 'C', 'B', 'E'];
      const actual = original.sort(compare);
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('#compareAlphabeticalCaseInsensitive', () => {
    const compare = compareAlphabeticalCaseInsensitive();

    it('should return a function', () => {
      expect(compare).to.be.a('function');
    });

    it('returned function should return less than zero for ascending values', () => {
      const result = compare('first', 'SECOND');
      expect(result).to.be.lessThan(0);
    });

    it('returned function should return greater than zero for descending values', () => {
      const result = compare('xylophone', 'aardvark');
      expect(result).to.be.greaterThan(0);
    });

    it('returned function should return zero for eqivalent values', () => {
      const result = compare('eQuAl', 'EqUal');
      expect(result).to.equal(0);
    });

    it('should accept an accessor function', () => {
      const compareWithAccessor = compareAlphabeticalCaseInsensitive(val => val.name);
      const a = {name: 'sox9a', count: 2};
      const b = {name: 'Pten', count: 9};
      const result = compareWithAccessor(a, b);
      expect(result).to.be.greaterThan(0);
    });

    it ('returned function should work wtih Array.sort()', () => {
      const original = ['Finn', 'and', 'Zoe', 'Are', 'fluffy', 'cats'];
      const expected = ['and', 'Are', 'cats', 'Finn', 'fluffy', 'Zoe'];
      const actual = original.sort(compare);
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('#sortBy', () => {
    it('should chain compare functions', () => {
      const order = ['ONE', 'TWO', 'THREE'];
      const original = ['THREE', 'TWO', 'FIVE', 'FOUR', 'FIVE', 'ONE', 'THREE', 'ONE'];
      const expected = ['ONE', 'ONE', 'TWO', 'THREE', 'THREE', 'FIVE', 'FIVE', 'FOUR'];
      const actual = sortBy(original, [
        compareByFixedOrder(order),
        compareAlphabeticalCaseInsensitive()
      ]);
      expect(actual).to.deep.equal(expected);
    });
  });
});
