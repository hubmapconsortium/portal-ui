import { getSearchHitsEntityCounts, EntityTypeSearchHit } from '../functions';

function getHitWithEntityType(entityType: string): EntityTypeSearchHit {
  return { _source: { entity_type: entityType } };
}

test('should count expected entities', () => {
  const hits: EntityTypeSearchHit[] = [
    getHitWithEntityType('Dataset'),
    getHitWithEntityType('Donor'),
    getHitWithEntityType('Sample'),
    getHitWithEntityType('Donor'),
  ];

  expect(getSearchHitsEntityCounts(hits)).toEqual({ Donor: 2, Sample: 1, Dataset: 1 });
});

test('should provide default 0 value for expected entities', () => {
  const hits: EntityTypeSearchHit[] = [];
  expect(getSearchHitsEntityCounts(hits)).toEqual({ Donor: 0, Sample: 0, Dataset: 0 });
});

test('should count unexpected entities', () => {
  const hits: EntityTypeSearchHit[] = [getHitWithEntityType('Dataset'), getHitWithEntityType('Support')];

  expect(getSearchHitsEntityCounts(hits)).toEqual({ Donor: 0, Sample: 0, Dataset: 1, Support: 1 });
});
