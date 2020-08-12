import { getByPath } from '../SearchWrapper';

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

    it('concatenates array values', () => {
      const document = { a: { b: { c: '42' } } };
      const field = { id: 'a.b.c', translations: { '42': 'The Answer' } };
      expect(getByPath(document, field)).toEqual('The Answer');
    });
  });
});
