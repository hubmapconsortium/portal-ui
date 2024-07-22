import { createProvDataURL, nonDestructiveMerge } from './utils';

describe('createProvDataURL', () => {
  it('returns a formatted URL based on the input UUID and base endpoint', () => {
    expect(createProvDataURL('uuid', 'entityEndpoint.com')).toEqual('entityEndpoint.com/entities/uuid/provenance');
  });
});

describe('nonDestructiveMerge', () => {
  it('merges objects without key conflicts the same as the spread operator', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    expect(nonDestructiveMerge(obj1, obj2, 'other')).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    expect(obj1).toEqual({ a: 1, b: 2 });
    expect(obj2).toEqual({ c: 3, d: 4 });
  });
  it('appends a key modifier to the key of a property in b if it already exists in a', () => {
    const obj3 = { a: 1, b: 2 };
    const obj4 = { a: 3, d: 4 };
    expect(nonDestructiveMerge(obj3, obj4, 'other')).toEqual({ a: 1, 'a-other': 3, b: 2, d: 4 });
  });
});
