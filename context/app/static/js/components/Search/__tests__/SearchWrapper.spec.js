import { getByPath } from '../SearchWrapper';

describe('SearchWrapper helper functions', () => {
  describe('getByPath', () => {
    it('extracts values by paths', () => {
      const document = { a: { b: { c: 'xyz' } } };
      const field = { id: 'a.b.c' };
      expect(getByPath(document, field)).toEqual('xyz');
    });
  });
});
