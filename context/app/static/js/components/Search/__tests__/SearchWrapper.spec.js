import { getByPath, getOrder } from '../SearchWrapper';

describe('SearchWrapper helper functions', () => {
  describe('getByPath', () => {
    it('extracts values by paths', () => {
      const document = { a: { b: { c: 'xyz' } } };
      const field = { id: 'a.b.c' };
      expect(getByPath(document, field)).toEqual('xyz');
    });

    it('concatenates array values', () => {
      const document = { a: { b: { c: ['x', 'y', 'z'] } } };
      const field = { id: 'a.b.c' };
      expect(getByPath(document, field)).toEqual('x / y / z');
    });

    it('looks up translations', () => {
      const document = { a: { b: { c: '42' } } };
      const field = { id: 'a.b.c', translations: { '42': 'The Answer' } };
      expect(getByPath(document, field)).toEqual('The Answer');
    });
  });

  describe('getOrder', () => {
    it('gets the order', () => {
      const pair = [
        { key: 'abc', order: 'desc' },
        { key: 'xyz', order: 'asc' },
      ];
      const selectedItems = ['abc'];
      expect(getOrder(pair, selectedItems)).toEqual('desc');
    });
  });
});
