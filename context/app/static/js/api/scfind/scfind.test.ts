import { createScFindKey } from './utils';

const scFindEndpoint = 'http://example.com';

describe('createScfindKey', () => {
  function expectURLIsValid(key: string) {
    expect(() => new URL(key)).not.toThrow();
  }

  it('should use the appropriate scfind base URL', () => {
    const key = createScFindKey(scFindEndpoint, 'endpoint', {});
    expect(key).toContain(scFindEndpoint);
    expectURLIsValid(key);
  });

  it.each(['endpoint1', 'endpoint2', 'endpoint3', 'my-weird-endpoint'])(
    'should use the appropriate provided endpoint',
    (endpoint) => {
      const key = createScFindKey(scFindEndpoint, endpoint, {});
      expect(key).toContain(endpoint);
      expectURLIsValid(key);
    },
  );

  it.each([
    {
      params: {
        param1: 'value1',
        param2: 'value2',
        param3: undefined,
      },
      definedKeys: ['param1', 'param2'],
      undefinedKeys: ['param3'],
    },
  ])('should filter out undefined passed params', ({ params, definedKeys, undefinedKeys }) => {
    const key = createScFindKey(scFindEndpoint, 'endpoint', params);
    definedKeys.forEach((k) => {
      expect(key.includes(k)).toBe(true);
    });
    undefinedKeys.forEach((k) => {
      expect(key.includes(k)).toBe(false);
    });
    expectURLIsValid(key);
  });
});
