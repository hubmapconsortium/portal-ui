import { ProcessedDatasetInfo } from './hooks';
import { ContactAPIResponse, ContributorAPIResponse } from '../../components/detailPage/ContributorsTable/utils';

export function datasetSectionId(dataset: Pick<ProcessedDatasetInfo, 'hubmap_id'>, prefix = '') {
  return `${prefix}-${encodeURIComponent(dataset.hubmap_id)}`.toLowerCase();
}

export function processDatasetLabel(
  dataset: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status' | 'hubmap_id'>,
  hits: { _source: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status'> }[],
) {
  const label = dataset.pipeline ?? dataset.assay_display_name[0];
  const hasMultipleHitsWithSameLabel =
    hits.filter((h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label).length > 1;

  const hasMultipleHitsWithSameLabelAndStatus =
    hasMultipleHitsWithSameLabel &&
    hits.filter(
      (h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label && h._source.status === dataset.status,
    ).length > 1;

  if (hasMultipleHitsWithSameLabelAndStatus) {
    return `${label} (${dataset.status}) [${dataset.hubmap_id}]`;
  }
  if (hasMultipleHitsWithSameLabel) {
    return `${label} (${dataset.status})`;
  }

  return label;
}

export function combinePeopleLists<T>(peopleLists: T[][]): T[] {
  // Use ORCiD to deduplicate the people if everyone has one; otherwise use name.
  const allHaveOrcid = peopleLists.every(
    (list) => list.every((person) => person?.orcid)
  );
  const personIdFn = allHaveOrcid
    ? (person) => person.orcid
    : (person) => `${person.first_name}|${person.middle_name_or_initial}|${person.last_name}|${person.affiliation}`;

  // Deduplicate people, keeping track of the sum of the person's index in each list
  // and the total number of lists in which the person appears.
  const seenPersonIds = new Set();
  const personIdxSum = new Map();
  const personCount = new Map();
  const combinedPeople: T[] = [];
  for (const list of peopleLists)
    list.forEach((person, i) => {
      const personId = personIdFn(person);
      if (seenPersonIds.has(personId)) {
        personIdxSum[personId] += i;
        personCount[personId] += 1;
      } else {
        seenPersonIds.add(personId);
        combinedPeople.push(person);
        personIdxSum[personId] = i;
        personCount[personId] = 1;
      }
    });

  // Sort the deduplicated list by average index (ascending) and count (descending).
  // In practice, most integrated datasets have the same contributor list for all
  // parent datasets. In these cases, the order will not change.
  combinedPeople.sort((a, b) => {
    const aId = personIdFn(a);
    const bId = personIdFn(b);
    const aCount = personCount[aId];
    const bCount = personCount[bId];
    const aIdxAvg = personIdxSum[aId] / aCount;
    const bIdxAvg = personIdxSum[bId] / bCount;
    if (aIdxAvg < bIdxAvg) return -1;
    if (bIdxAvg < aIdxAvg) return 1;
    if (aCount > bCount) return -1;
    if (bCount > aCount) return 1;
    return 0;
  });

  return combinedPeople;
}
