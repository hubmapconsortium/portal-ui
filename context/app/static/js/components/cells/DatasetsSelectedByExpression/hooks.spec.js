import { buildHitsMap } from './hooks';

test('should first', () => {
  expect(buildHitsMap([{ _id: 'a' }, { _id: 'b' }])).toEqual({
    a: { _id: 'a' },
    b: { _id: 'b' },
  });
});
