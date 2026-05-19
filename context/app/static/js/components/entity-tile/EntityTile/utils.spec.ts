import { getTileDescendantCounts } from './utils';

const donorSampleDefault = { Sample: 0, Dataset: 0 };

test.each([
  ['Donor', donorSampleDefault],
  ['Sample', donorSampleDefault],
  ['Dataset', { Dataset: 0 }],
])('Returns correct default counts for %s when descendant counts does not exist in source', (entityType, expected) => {
  expect(getTileDescendantCounts({}, entityType)).toStrictEqual(expected);
});

const donorSampleCounts = { Dataset: 5, Sample: 12 };

test.each([
  ['Donor', donorSampleCounts],
  ['Sample', donorSampleCounts],
  ['Dataset', { Dataset: 5 }],
])('Returns correct counts when for %s when all expected types are defined', (entityType, expected) => {
  expect(
    getTileDescendantCounts(
      {
        descendant_counts: {
          entity_type: {
            Dataset: 5,
            Sample: 12,
          },
        },
      },
      entityType,
    ),
  ).toStrictEqual(expected);
});

const donorSampleFilledCounts = { Dataset: 0, Sample: 12 };

test.each([
  ['Donor', donorSampleFilledCounts],
  ['Sample', donorSampleFilledCounts],
  ['Dataset', { Dataset: 0 }],
])('Fills missing counts for %s with defaults all', (entityType, expected) => {
  expect(
    getTileDescendantCounts(
      {
        descendant_counts: {
          entity_type: {
            Sample: 12,
          },
        },
      },
      entityType,
    ),
  ).toStrictEqual(expected);
});
