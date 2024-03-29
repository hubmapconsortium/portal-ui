import { buildNumericFacetsProps } from './hooks';

describe('buildNumericFacetsProps', () => {
  test('builds numeric facets props given es aggs', () => {
    const fieldsStats = {
      a: {
        max: 99.5,
        min: 0.2,
      },
      b: {
        max: 20,
        min: 5,
      },
    };

    expect(buildNumericFacetsProps(fieldsStats)).toEqual({
      a: {
        max: 100,
        min: 0,
        interval: 5,
      },
      b: {
        max: 20,
        min: 5,
        interval: 1,
      },
    });
  });
});
