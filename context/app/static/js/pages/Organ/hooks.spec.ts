import { filterDatasets, DATASETS_WITH_LABELS } from './hooks';

describe('filterDatasets', () => {
  it.each(DATASETS_WITH_LABELS)(
    "should return true if the provided search hit's ID is included in DATASETS_WITH_LABELS",
    (_id) => {
      const searchHit = { _id };
      expect(filterDatasets(searchHit)).toBe(true);
    },
  );
  it('should return false if the provided search hit is not included in DATASETS_WITH_LABELS', () => {
    const searchHit = { _id: 'not included' };
    expect(filterDatasets(searchHit)).toBe(false);
  });
});
